import type { IOperator } from '../../operator.types';

export class NotEqualOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value !== targetValue;
  }
} 