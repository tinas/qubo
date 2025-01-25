import type { IOperator } from '../../operator.types';

export class DateBetweenOperator implements IOperator {
  evaluate(value: Date, targetValue: [Date | string, Date | string]): boolean {
    if (!(value instanceof Date)) return false;
    const [start, end] = targetValue.map(d => new Date(d));
    return value >= start && value <= end;
  }
} 