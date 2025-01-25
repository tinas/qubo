import type { IOperator } from '../../operator.types';

export class GreaterThanOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value > targetValue;
  }
} 