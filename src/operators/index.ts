import type { OperatorFn } from '../types'
import { arrayOperators } from './array'
import { comparisonOperators } from './comparison'
import { elementOperators } from './element'
import { logicalOperators } from './logical'

export const defaultOperators: Record<string, OperatorFn> = {
  ...comparisonOperators,
  ...logicalOperators,
  ...arrayOperators,
  ...elementOperators,
}
