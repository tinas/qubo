import { QuboError } from './errors'
import type { OperatorContext, OperatorFn, Query } from './types'
import { isPlainObject } from './utils/is-plain-object'
import { resolvePath } from './utils/resolve-path'

export function createEvaluator(
  operators: Record<string, OperatorFn>,
): (document: unknown, query: Query) => boolean {
  function applyOperator(
    name: string,
    value: unknown,
    operand: unknown,
    context: OperatorContext,
  ): boolean {
    const operator = operators[name]
    if (!operator) {
      throw new QuboError(`Unsupported operator: ${name}`)
    }
    return operator(value, operand, context)
  }

  function matchCondition(value: unknown, condition: unknown, context: OperatorContext): boolean {
    if (isPlainObject(condition)) {
      return Object.entries(condition).every(([name, operand]) =>
        applyOperator(name, value, operand, context),
      )
    }
    return applyOperator('$eq', value, condition, context)
  }

  function matchQuery(value: unknown, query: Query, context: OperatorContext): boolean {
    if (!isPlainObject(query)) {
      throw new QuboError('Query must be a plain object.')
    }
    return Object.entries(query).every(([key, condition]) =>
      key.startsWith('$')
        ? applyOperator(key, value, condition, context)
        : matchCondition(context.resolve(value, key), condition, context),
    )
  }

  return (document, query) => {
    const context: OperatorContext = {
      root: document,
      resolve: resolvePath,
      match: (value, subQuery) => matchQuery(value, subQuery, context),
    }
    return matchQuery(document, query, context)
  }
}
