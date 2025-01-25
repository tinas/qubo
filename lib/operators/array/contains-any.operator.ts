import type { IOperator } from '../../operator.types';

export class ArrayContainsAnyOperator implements IOperator {
  evaluate(value: any[], targetValue: any[]): boolean {
    return Array.isArray(value) && Array.isArray(targetValue) &&
           targetValue.some(item => value.includes(item));
  }
} 