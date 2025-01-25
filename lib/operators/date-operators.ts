import { DateAfterOperator } from './date/date-after.operator';
import { DateBeforeOperator } from './date/date-before.operator';
import { DateBetweenOperator } from './date/date-between.operator';
import { DateWithinOperator } from './date/date-within.operator';
import { SameDayOperator } from './date/same-day.operator';

export const dateOperators = {
  $after: DateAfterOperator,
  $before: DateBeforeOperator,
  $between: DateBetweenOperator,
  $within: DateWithinOperator,
  $sameDay: SameDayOperator,
};
