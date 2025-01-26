import { BaseOperator } from '../base.operator';

/**
 * Operator that checks if a string contains another string.
 */
export class ContainsOperator extends BaseOperator<string, string> {
  evaluate(value: string, condition: string): boolean {
    if (typeof value !== 'string' || typeof condition !== 'string') {
      return false;
    }

    return value.includes(condition);
  }
} 