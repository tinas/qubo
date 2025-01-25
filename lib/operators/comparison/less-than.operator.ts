import type { IOperator } from '../../operator.types';

export class LessThanOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value < targetValue;
  }
} 