import type { IDateOperator } from '../../operator.types';
import { BaseOperator } from '../base.operator';

export class DateAfterOperator extends BaseOperator<Date, Date | string> implements IDateOperator<Date | string> {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date) || !targetValue) return false;
    if (isNaN(value.getTime())) return false;

    try {
      const target = typeof targetValue === 'string' ? new Date(targetValue) : targetValue;
      if (isNaN(target.getTime())) return false;

      // Convert both dates to UTC for consistent comparison
      const valueTime = value.getTime();
      const targetTime = target.getTime();

      // For dates without time components (e.g. '2024-01-25'), compare only the dates
      if (typeof targetValue === 'string' && !targetValue.includes('T')) {
        const valueDate = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
        const targetDate = new Date(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
        return valueDate.getTime() > targetDate.getTime();
      }

      return valueTime > targetTime;
    } catch {
      return false;
    }
  }

  protected getCacheKey(value: Date, targetValue: Date | string): string {
    if (!(value instanceof Date)) return 'invalid';
    if (isNaN(value.getTime())) return 'invalid';

    try {
      const target = typeof targetValue === 'string' ? new Date(targetValue) : targetValue;
      if (isNaN(target.getTime())) return 'invalid';
      return `${value.getTime()}-${target.getTime()}`;
    } catch {
      return 'invalid';
    }
  }
} 