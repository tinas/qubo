import { BaseOperator } from '../base.operator';

/**
 * Operator that checks if a date is before another date.
 */
export class DateBeforeOperator extends BaseOperator<Date, string | Date> {
  evaluate(value: Date, condition: string | Date): boolean {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }

    const targetDate = condition instanceof Date ? condition : new Date(condition);
    if (isNaN(targetDate.getTime())) {
      return false;
    }

    return value.getTime() < targetDate.getTime();
  }
} 