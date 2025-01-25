import type { IOperator } from '../../operator.types';

export class EndsWithOperator implements IOperator {
  evaluate(value: string, targetValue: string): boolean {
    return typeof value === 'string' && value.endsWith(targetValue);
  }
} 