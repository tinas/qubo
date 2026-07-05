import type { OperatorFn } from '../types'

export const elementOperators: Record<string, OperatorFn> = {
  $exists: (value, operand) => (value !== undefined) === Boolean(operand),
}
