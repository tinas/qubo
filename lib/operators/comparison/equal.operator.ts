import type { IComparisonOperator } from '../../operator.types';

/**
 * Operator that checks if two values are strictly equal (===).
 * 
 * @template T - The type of values being compared
 * @example
 * const operator = new EqualOperator<number>();
 * operator.evaluate(5, 5); // returns true
 * operator.evaluate(5, '5'); // returns false (strict equality)
 */
export class EqualOperator<T> implements IComparisonOperator<T> {
  /**
   * Evaluates if two values are strictly equal.
   * 
   * @param value - The value to compare
   * @param targetValue - The target value to compare against
   * @returns True if the values are strictly equal, false otherwise
   */
  evaluate(value: T, targetValue: T): boolean {
    return value === targetValue;
  }
} 