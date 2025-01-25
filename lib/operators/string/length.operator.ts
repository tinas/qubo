import type { IOperator } from '../../operator.types';

export class StringLengthOperator implements IOperator {
  evaluate(value: string, targetValue: number): boolean {
    return typeof value === 'string' && value.length === targetValue;
  }
} 