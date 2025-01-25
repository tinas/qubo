import type { IOperator } from '../../operator.types';

export class RegexOperator implements IOperator {
  evaluate(value: string, pattern: string): boolean {
    if (typeof value !== 'string') return false;
    try {
      return new RegExp(pattern).test(value);
    } catch {
      return false;
    }
  }
} 