import { QuboError } from './errors'
import { createEvaluator } from './evaluate'
import { defaultOperators } from './operators/index'
import type { OperatorFn, Qubo, QuboOptions, Query } from './types'

/**
 * Creates a stateless query engine. Data is passed per call, so a single
 * instance can evaluate any number of documents or collections.
 *
 * @example
 * ```typescript
 * const qubo = createQubo()
 *
 * qubo.evaluate({ age: 30 }, { age: { $gte: 18 } }) // true
 * qubo.find(users, { 'address.city': { $in: ['Boston', 'New York'] } })
 *
 * // Custom operators receive a context to recurse into sub-queries:
 * const custom = createQubo({
 *   operators: {
 *     $none: (value, operand, context) =>
 *       Array.isArray(value) && !value.some(element => context.match(element, operand as Query)),
 *   },
 * })
 * custom.evaluate({ scores: [1, 2] }, { scores: { $none: { $gt: 10 } } }) // true
 * ```
 */
export function createQubo(options: QuboOptions = {}): Qubo {
  const operators: Record<string, OperatorFn> = { ...defaultOperators }

  for (const [name, operator] of Object.entries(options.operators ?? {})) {
    if (!name.startsWith('$')) {
      throw new QuboError(`Operator names must start with "$": ${name}`)
    }
    if (typeof operator !== 'function') {
      throw new QuboError(`Operator ${name} must be a function.`)
    }
    operators[name] = operator
  }

  const evaluate = createEvaluator(operators)
  const compile = (query: Query) => (document: unknown) => evaluate(document, query)

  return {
    evaluate,
    compile,
    find: (data, query) => data.filter(compile(query)),
    findOne: (data, query) => data.find(compile(query)),
  }
}
