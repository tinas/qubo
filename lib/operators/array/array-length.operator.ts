import { BaseOperator } from '../base.operator';

/**
 * Operator that checks if an array has a specific length.
 */
export class ArrayLengthOperator<T> extends BaseOperator<T[], number> {
  evaluate(value: T[], condition: number): boolean {
    if (!Array.isArray(value) || typeof condition !== 'number') {
      return false;
    }

    return value.length === condition;
  }
} 