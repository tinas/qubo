import type { IOperator } from '../operator.types';

/**
 * Base operator class that provides common functionality for all operators.
 * Implements caching and key generation for improved performance.
 *
 * @template TValue - The type of the value to evaluate
 * @template TTarget - The type of the target value to compare against
 */
export abstract class BaseOperator<TValue = unknown, TTarget = unknown> implements IOperator<TValue, TTarget> {
  private cache = new Map<string, boolean>();
  private useCache = true;

  /**
   * Abstract method that must be implemented by all operators.
   * Evaluates if the given value matches the target value according to the operator's logic.
   *
   * @param value - The value to evaluate
   * @param targetValue - The target value to compare against
   * @returns True if the value matches the target value according to the operator's logic
   */
  abstract evaluate(value: TValue, targetValue: TTarget): boolean;

  /**
   * Generates a cache key for the given value and target value pair.
   *
   * @param value - The value to generate a key for
   * @param targetValue - The target value to generate a key for
   * @returns A string key that uniquely identifies the value pair
   * @protected
   */
  protected getCacheKey(value: TValue, targetValue: TTarget): string {
    return this.generateCacheKey(value) + '-' + this.generateCacheKey(targetValue);
  }

  /**
   * Generates a cache key for a single value.
   * Handles different types of values (null, string, number, boolean, Date, Array, Object).
   *
   * @param value - The value to generate a key for
   * @returns A string key that uniquely identifies the value
   * @protected
   */
  protected generateCacheKey(value: unknown): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value.toString();
    if (value instanceof Date) return value.getTime().toString();
    if (Array.isArray(value)) return this.generateArrayKey(value);
    if (typeof value === 'object') return this.generateObjectKey(value as Record<string, unknown>);
    return String(value);
  }

  /**
   * Generates a cache key for an array value.
   * Uses up to first 3 elements for performance.
   *
   * @param array - The array to generate a key for
   * @returns A string key that uniquely identifies the array
   * @private
   */
  private generateArrayKey(array: unknown[]): string {
    if (array.length === 0) return '[]';
    return `[${array.slice(0, 3).map((item) => this.generateCacheKey(item)).join(',')}]`;
  }

  /**
   * Generates a cache key for an object value.
   *
   * @param object - The object to generate a key for
   * @returns A string key that uniquely identifies the object
   * @private
   */
  private generateObjectKey(object: Record<string, unknown>): string {
    const keys = Object.keys(object).sort();
    if (keys.length === 0) return '{}';
    return `{${keys.map((key) => `${key}:${this.generateCacheKey(object[key])}`).join(',')}}`;
  }

  /**
   * Generates a hash value for a string.
   *
   * @param string_ - The string to hash
   * @returns A numeric hash value
   * @protected
   */
  protected hash(string_: string): number {
    let hash = 0;
    for (let index = 0; index < string_.length; index++) {
      const code = string_.codePointAt(index) ?? 0;
      hash = ((hash << 5) - hash) + code;
      hash = Math.trunc(hash);
    }
    return hash;
  }

  /**
   * Enables caching of evaluation results.
   */
  enableCache(): void {
    this.useCache = true;
  }

  /**
   * Disables caching of evaluation results.
   */
  disableCache(): void {
    this.useCache = false;
  }

  /**
   * Clears all cached evaluation results.
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Retrieves a cached evaluation result.
   *
   * @param key - The cache key to look up
   * @returns The cached boolean result, or undefined if not found
   * @protected
   */
  protected getFromCache(key: string): boolean | undefined {
    if (!this.useCache) return undefined;
    return this.cache.get(key);
  }

  /**
   * Stores an evaluation result in the cache.
   *
   * @param key - The cache key to store under
   * @param value - The boolean result to cache
   * @protected
   */
  protected setInCache(key: string, value: boolean): void {
    if (!this.useCache) return;
    this.cache.set(key, value);
  }
}
