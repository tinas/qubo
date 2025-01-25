import type { IOperator } from '../../operator.types';

export class LessThanEqualOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value <= targetValue;
  }
} 