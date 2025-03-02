import { QuboOptions, OperatorFunction, QuboInstance } from './types'
import { createComparisonOperators } from './core/operators/comparison-operators'
import { createElementMatchOperator } from './core/operators/element-match-operator'
import { evaluateDocument } from './core/evaluate-document'

/**
 * Creates a new Qubo instance for querying and filtering arrays of objects, similar to MongoDB's query syntax.
 *
 * @template T - The type of objects in your data array
 * @param dataSource - An array of objects you want to query
 * @param options - Optional configuration to extend Qubo with custom operators
 * @returns A QuboInstance that provides methods to query your data
 *
 * @example
 * ```typescript
 * // Your data array
 * const items = [
 *   { id: 1, category: 'foo', tags: ['a', 'b'], value: 100 },
 *   { id: 2, category: 'bar', tags: ['b'], value: 200 },
 *   { id: 3, category: 'baz', tags: ['a', 'c'], value: 300 }
 * ];
 *
 * // Create a Qubo instance
 * const qubo = createQubo(items);
 *
 * // Find items with value greater than 150
 * const highValue = qubo.find({ value: { $gt: 150 } });
 *
 * // Find first item with tag 'a'
 * const hasTagA = qubo.findOne({ tags: { $elemMatch: 'a' } });
 *
 * // Check if an item matches criteria
 * const meetsThreshold = qubo.evaluateOne(items[0], { value: { $gte: 100 } });
 * ```
 */
export function createQubo<T>(dataSource: T[], options?: QuboOptions<T>): QuboInstance<T> {
  const baseOperators = createComparisonOperators<T>()
  baseOperators['$elemMatch'] = createElementMatchOperator(baseOperators)

  const allOperators: Record<string, OperatorFunction<T>> = {
    ...baseOperators,
    ...options?.operators,
  }

  return {
    evaluate(query: Record<string, unknown>): boolean[] {
      return dataSource.map((document) => evaluateDocument(document, query, allOperators))
    },

    find(query: Record<string, unknown>): T[] {
      return dataSource.filter((document) => evaluateDocument(document, query, allOperators))
    },

    findOne(query: Record<string, unknown>): T | undefined {
      return dataSource.find((document) => evaluateDocument(document, query, allOperators))
    },

    evaluateOne(document: T, query: Record<string, unknown>): boolean {
      return evaluateDocument(document, query, allOperators)
    },
  }
}
