import type { IOperator } from '../../operator.types';

export class ArrayEmptyOperator implements IOperator {
  evaluate(value: any[]): boolean {
    return Array.isArray(value) && value.length === 0;
  }
} 