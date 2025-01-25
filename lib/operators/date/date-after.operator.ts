import type { IOperator } from '../../operator.types';

export class DateAfterOperator implements IOperator {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date)) return false;
    return value > new Date(targetValue);
  }
} 