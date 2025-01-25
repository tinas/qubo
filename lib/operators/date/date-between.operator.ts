import type { IOperator } from '../../operator.types';

export class DateBetweenOperator implements IOperator<Date, [Date | string, Date | string]> {
  evaluate(value: Date, targetValue: [Date | string, Date | string] | null): boolean {
    if (!(value instanceof Date) || !targetValue) return false;
    const [startDate, endDate] = targetValue;
    if (!startDate || !endDate) return false;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return value >= start && value <= end;
    } catch {
      return false;
    }
  }
} 