import type { IStringOperator } from '../../operator.types';
import { BaseOperator } from '../base.operator';

/**
 * Operator that checks if a string contains another string.
 * Optimized for different string lengths and includes caching.
 * Extends BaseOperator to leverage caching functionality.
 * 
 * @example
 * const operator = new ContainsOperator();
 * operator.evaluate('hello world', 'world'); // returns true
 * operator.evaluate('hello world', 'xyz'); // returns false
 * operator.evaluate(null, 'world'); // returns false
 */
export class ContainsOperator extends BaseOperator<string, string> implements IStringOperator {
  /**
   * Evaluates if the value string contains the target string.
   * Uses caching and delegates to evaluateInternal for actual check.
   * 
   * @param value - The string to search in
   * @param targetValue - The string to search for
   * @returns True if value contains targetValue, false otherwise
   */
  evaluate(value: string, targetValue: string): boolean {
    const cacheKey = this.getCacheKey(value, targetValue);
    const cached = this.getFromCache(cacheKey);
    if (cached !== undefined) return cached;

    const result = this.evaluateInternal(value, targetValue);
    this.setInCache(cacheKey, result);
    return result;
  }

  /**
   * Internal evaluation logic for string containment.
   * Uses different strategies based on string length for optimization.
   * 
   * @param value - The string to search in
   * @param targetValue - The string to search for
   * @returns True if value contains targetValue, false otherwise
   * @protected
   */
  protected evaluateInternal(value: string, targetValue: string): boolean {
    // Type check is faster than typeof for hot paths
    if (!value || !targetValue) return false;
    if (Object.prototype.toString.call(value) !== '[object String]') return false;
    
    // For very short strings, indexOf might be faster
    if (targetValue.length <= 3) {
      return value.indexOf(targetValue) !== -1;
    }
    
    return value.includes(targetValue);
  }

  /**
   * Generates a cache key for string containment check.
   * Includes string lengths to handle empty strings correctly.
   * 
   * @param value - The string to search in
   * @param targetValue - The string to search for
   * @returns A string key for caching
   * @protected
   */
  protected getCacheKey(value: string, targetValue: string): string {
    // Handle null and undefined values
    if (!value || !targetValue) return `${value}:${targetValue}`;
    
    // For strings, we can use a simple concatenation
    // Add length to handle empty strings correctly
    return `${value.length}:${value}-${targetValue.length}:${targetValue}`;
  }
} 