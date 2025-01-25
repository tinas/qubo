import type { IArrayOperator } from '../../operator.types';
import { BaseOperator } from '../base.operator';

/**
 * Operator that checks if an array's length matches a target value.
 * Extends BaseOperator to leverage caching functionality.
 * 
 * @template T - The type of array elements
 * @example
 * const operator = new ArrayLengthOperator<string>();
 * operator.evaluate(['a', 'b', 'c'], 3); // returns true
 * operator.evaluate(['a', 'b'], 3); // returns false
 * operator.evaluate('not an array', 3); // returns false
 */
export class ArrayLengthOperator<T> extends BaseOperator<T[], number> implements IArrayOperator<T, number> {
  /**
   * Evaluates if the array's length matches the target value.
   * 
   * @param value - The array to check
   * @param targetValue - The expected length
   * @returns True if the array's length matches the target value, false otherwise
   */
  evaluate(value: T[], targetValue: number): boolean {
    return Array.isArray(value) && value.length === targetValue;
  }

  /**
   * Generates a cache key for the given value and target value.
   * 
   * @param value - The array to check
   * @param targetValue - The expected length
   * @returns A string key for caching
   */
  protected getCacheKey(value: T[], targetValue: number): string {
    return `${Array.isArray(value) ? value.length : 'not-array'}-${targetValue}`;
  }
} 