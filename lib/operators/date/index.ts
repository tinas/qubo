import type { IOperator } from '../../operator.types';
import { DateWithinOperator } from './date-within.operator';
import { DateBetweenOperator } from './date-between.operator';
import { DateAfterOperator } from './date-after.operator';
import { DateBeforeOperator } from './date-before.operator';
import { SameDayOperator } from './same-day.operator';
// ... import other operators

export const dateOperators = new Map<string, IOperator>([
  ['$dateWithin', new DateWithinOperator()],
  ['$dateBetween', new DateBetweenOperator()],
  ['$dateAfter', new DateAfterOperator()],
  ['$dateBefore', new DateBeforeOperator()],
  ['$sameDay', new SameDayOperator()],
  // ... add other operators
]);

export * from './date-within.operator';
export * from './date-between.operator';
export * from './date-after.operator';
export * from './date-before.operator';
export * from './same-day.operator'; 