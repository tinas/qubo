import { BaseOperator } from '../base.operator';

interface DateWithinCondition {
  days: number;
}

/**
 * Operator that checks if a date is within a specified number of days from now.
 */
export class DateWithinOperator extends BaseOperator<Date, DateWithinCondition> {
  evaluate(value: Date, condition: DateWithinCondition): boolean {
    if (!value || !(value instanceof Date) || isNaN(value.getTime())) {
      return false;
    }

    if (!condition || typeof condition.days !== 'number' || condition.days <= 0) {
      return false;
    }

    const now = new Date();
    const diffInDays = Math.abs(now.getTime() - value.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= condition.days;
  }
} 