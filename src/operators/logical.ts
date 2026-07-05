import { QuboError } from '../errors'
import type { OperatorFn, Query } from '../types'
import { isPlainObject } from '../utils/is-plain-object'

function toQueries(name: string, operand: unknown): Query[] {
  if (!Array.isArray(operand)) {
    throw new QuboError(`${name} expects an array of queries.`)
  }
  return operand as Query[]
}

export const logicalOperators: Record<string, OperatorFn> = {
  $and: (value, operand, context) =>
    toQueries('$and', operand).every(query => isPlainObject(query) && context.match(value, query)),
  $or: (value, operand, context) =>
    toQueries('$or', operand).some(query => isPlainObject(query) && context.match(value, query)),
  $nor: (value, operand, context) =>
    !toQueries('$nor', operand).some(query => isPlainObject(query) && context.match(value, query)),
  $not: (value, operand, context) => {
    if (!isPlainObject(operand)) {
      throw new QuboError('$not expects a query object.')
    }
    return !context.match(value, operand)
  },
}
