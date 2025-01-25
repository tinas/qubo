import { BaseOperator } from '../base.operator';
import type { IDateOperator } from '../../operator.types';

export class DateBetweenOperator extends BaseOperator<Date, [Date | string, Date | string]> implements IDateOperator<[Date | string, Date | string]> {
  evaluate(value: Date, targetValue: [Date | string, Date | string] | null): boolean {
    if (!(value instanceof Date) || !targetValue) return false;
    const [startDate, endDate] = targetValue;
    if (!startDate || !endDate) return false;
    if (isNaN(value.getTime())) return false;

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const valueTime = value.getTime();
      const startTime = start.getTime();
      const endTime = end.getTime();

      if (isNaN(startTime) || isNaN(endTime)) {
        return false;
      }

      // For dates without time components, compare only the dates
      if ((typeof startDate === 'string' && !startDate.includes('T')) ||
          (typeof endDate === 'string' && !endDate.includes('T'))) {
        const valueDate = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
        const startDate = new Date(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
        const endDate = new Date(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
        return valueDate.getTime() >= startDate.getTime() && valueDate.getTime() <= endDate.getTime();
      }

      return valueTime >= startTime && valueTime <= endTime;
    } catch (error) {
      // This can happen if Date constructor throws (e.g., with invalid date strings)
      return false;
    }
  }

  getCacheKey(value: Date, targetValue: [Date | string, Date | string] | null): string {
    if (!(value instanceof Date) || !targetValue) return 'invalid';
    const [startDate, endDate] = targetValue;
    if (!startDate || !endDate) return 'invalid';
    if (isNaN(value.getTime())) return 'invalid';

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const valueTime = value.getTime();
      const startTime = start.getTime();
      const endTime = end.getTime();

      if (isNaN(valueTime) || isNaN(startTime) || isNaN(endTime)) {
        return 'invalid';
      }

      // For dates without time components, use date-only values in cache key
      if ((typeof startDate === 'string' && !startDate.includes('T')) ||
          (typeof endDate === 'string' && !endDate.includes('T'))) {
        const valueDate = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
        const startDate = new Date(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
        const endDate = new Date(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
        return `${valueDate.getTime()}-${startDate.getTime()}-${endDate.getTime()}`;
      }

      return `${valueTime}-${startTime}-${endTime}`;
    } catch (error) {
      // This can happen if Date constructor throws (e.g., with invalid date strings)
      return 'invalid';
    }
  }
} 