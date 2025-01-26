import { BaseOperator } from '../base.operator';

/**
 * Operator that checks if a date is between two other dates.
 */
export class DateBetweenOperator extends BaseOperator<Date, [string | Date, string | Date]> {
  evaluate(value: Date, condition: [string | Date, string | Date]): boolean {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }

    if (!Array.isArray(condition) || condition.length !== 2) {
      return false;
    }

    const [startDate, endDate] = condition;
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }

    const valueTime = value.getTime();
    return valueTime >= start.getTime() && valueTime <= end.getTime();
  }
} 