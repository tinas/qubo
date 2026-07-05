import type { OperatorFn } from '../types'
import { compare } from '../utils/compare'
import { deepEqual } from '../utils/deep-equal'

function equals(value: unknown, operand: unknown): boolean {
  if (Array.isArray(value) && value.some(element => deepEqual(element, operand))) {
    return true
  }
  return deepEqual(value, operand)
}

function matchesOrder(
  value: unknown,
  operand: unknown,
  isMatch: (order: number) => boolean,
): boolean {
  if (Array.isArray(value)) {
    return value.some(element => {
      const order = compare(element, operand)
      return order !== undefined && isMatch(order)
    })
  }
  const order = compare(value, operand)
  return order !== undefined && isMatch(order)
}

export const comparisonOperators: Record<string, OperatorFn> = {
  $eq: (value, operand) => equals(value, operand),
  $ne: (value, operand) => !equals(value, operand),
  $gt: (value, operand) => matchesOrder(value, operand, order => order > 0),
  $gte: (value, operand) => matchesOrder(value, operand, order => order >= 0),
  $lt: (value, operand) => matchesOrder(value, operand, order => order < 0),
  $lte: (value, operand) => matchesOrder(value, operand, order => order <= 0),
  $in: (value, operand) =>
    Array.isArray(operand) && operand.some(candidate => equals(value, candidate)),
  $nin: (value, operand) =>
    Array.isArray(operand) && operand.every(candidate => !equals(value, candidate)),
}
