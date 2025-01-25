import type { IOperator } from '../../operator.types';

export class ArrayContainsOperator implements IOperator {
  evaluate(value: any[], targetValue: any): boolean {
    return Array.isArray(value) && value.includes(targetValue);
  }
} 