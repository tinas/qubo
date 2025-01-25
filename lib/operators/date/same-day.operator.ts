import type { IOperator } from '../../operator.types';

export class SameDayOperator implements IOperator<Date, Date | string> {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date) || !targetValue) return false;

    try {
      const target = typeof targetValue === 'string' ? new Date(targetValue) : targetValue;
      if (isNaN(target.getTime())) return false;

      // Convert both dates to UTC to ensure consistent comparison
      return (
        value.getUTCFullYear() === target.getUTCFullYear() &&
        value.getUTCMonth() === target.getUTCMonth() &&
        value.getUTCDate() === target.getUTCDate()
      );
    } catch (error) {
      return false;
    }
  }
} 