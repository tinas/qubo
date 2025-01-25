import type { IOperator } from '../../operator.types';

export class ArrayContainsAllOperator implements IOperator {
  evaluate(value: any[], targetValue: any[]): boolean {
    return Array.isArray(value) && Array.isArray(targetValue) &&
           targetValue.every(item => value.includes(item));
  }
} 