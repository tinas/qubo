import type { IOperator } from '../../operator.types';

export class EndsWithOperator implements IOperator<string, string> {
  evaluate(value: string, targetValue: string): boolean {
    return typeof value === 'string' && value.endsWith(targetValue);
  }
} 