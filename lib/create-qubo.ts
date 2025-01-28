import { QuboOptions, OperatorFunction } from './types';
import { createComparisonOperators } from './core/operators/comparison-operators';
import { createElementMatchOperator } from './core/operators/element-match-operator';
import { evaluateDocument } from './core/evaluate-document';

/**
 * Creates a new Qubo instance for querying and filtering arrays of objects
 * @template T The type of objects in the data source
 * @param dataSource The array of objects to query
 * @param options Optional configuration for custom operators
 * @returns An object containing methods for querying the data source
 */
export function createQubo<T>(dataSource: T[], options?: QuboOptions<T>) {
  const baseOperators = createComparisonOperators<T>();
  baseOperators['$elemMatch'] = createElementMatchOperator(baseOperators);

  const allOperators: Record<string, OperatorFunction<T>> = {
    ...baseOperators,
    ...options?.operators,
  };

  return {
    /**
     * Evaluates a query against all documents in the data source
     * @param query The query to evaluate
     * @returns An array of boolean values indicating which documents match the query
     */
    evaluate(query: Record<string, unknown>): boolean[] {
      return dataSource.map((document) => evaluateDocument(document, query, allOperators));
    },

    /**
     * Finds all documents that match the given query
     * @param query The query to match against
     * @returns An array of matching documents
     */
    find(query: Record<string, unknown>): T[] {
      return dataSource.filter((document) => evaluateDocument(document, query, allOperators));
    },

    /**
     * Finds the first document that matches the given query
     * @param query The query to match against
     * @returns The first matching document or undefined if none found
     */
    findOne(query: Record<string, unknown>): T | undefined {
      return dataSource.find((document) => evaluateDocument(document, query, allOperators));
    },

    /**
     * Evaluates a single document against the given query
     * @param doc The document to evaluate
     * @param query The query to match against
     * @returns Whether the document matches the query
     */
    evaluateOne(document: T, query: Record<string, unknown>): boolean {
      return evaluateDocument(document, query, allOperators);
    },
  };
}
