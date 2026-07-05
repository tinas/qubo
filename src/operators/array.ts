import { QuboError } from '../errors'
import type { OperatorFn } from '../types'
import { isPlainObject } from '../utils/is-plain-object'

export const arrayOperators: Record<string, OperatorFn> = {
  $elemMatch: (value, operand, context) => {
    if (!isPlainObject(operand)) {
      throw new QuboError('$elemMatch expects a query object.')
    }
    return Array.isArray(value) && value.some(element => context.match(element, operand))
  },
  $size: (value, operand) =>
    typeof operand === 'number' && Array.isArray(value) && value.length === operand,
}
