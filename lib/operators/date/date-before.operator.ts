import type { IOperator } from '../../operator.types';

export class DateBeforeOperator implements IOperator {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date)) return false;
    return value < new Date(targetValue);
  }
} 