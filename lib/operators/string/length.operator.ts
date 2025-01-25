import type { IOperator } from '../../operator.types';

export class StringLengthOperator implements IOperator<string, number> {
  evaluate(value: string, targetValue: number): boolean {
    if (typeof value !== 'string' || typeof targetValue !== 'number') return false;
    return Array.from(value).length === targetValue;
  }
} 