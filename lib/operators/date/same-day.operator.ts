import type { IOperator } from '../../operator.types';

export class SameDayOperator implements IOperator {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date)) return false;
    const target = new Date(targetValue);
    return value.getFullYear() === target.getFullYear() &&
           value.getMonth() === target.getMonth() &&
           value.getDate() === target.getDate();
  }
} 