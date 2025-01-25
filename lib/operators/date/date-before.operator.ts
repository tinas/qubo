import type { IOperator } from '../../operator.types';

export class DateBeforeOperator implements IOperator<Date, Date | string> {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date) || !targetValue) return false;
    try {
      return value < new Date(targetValue);
    } catch {
      return false;
    }
  }
} 