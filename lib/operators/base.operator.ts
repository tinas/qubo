/**
 * Base operator class that provides common functionality for all operators.
 * Implements caching and key generation for improved performance.
 *
 * @template TValue - The type of the value to evaluate
 * @template TTarget - The type of the target value to compare against
 */
export abstract class BaseOperator<T, C = unknown> {
  private cache = new Map<string, boolean>();
  private useCache = true;
  private objectReferenceMap = new WeakMap<object, string>();
  private nextObjectId = 1;

  /**
   * Abstract method that must be implemented by all operators.
   * Evaluates if the given value matches the target value according to the operator's logic.
   *
   * @param value - The value to evaluate
   * @param condition - The target value to compare against
   * @returns True if the value matches the target value according to the operator's logic
   */
  abstract evaluate(value: T, condition: C): boolean;

  /**
   * Generates a cache key for the given value and target value pair.
   *
   * @param value - The value to generate a key for
   * @param targetValue - The target value to generate a key for
   * @returns A string key that uniquely identifies the value pair
   * @protected
   */
  protected getCacheKey(value: T, targetValue: unknown): string {
    return `${this.generateCacheKey(value)}-${this.generateCacheKey(targetValue)}`;
  }

  /**
   * Exposes the protected getCacheKey method for testing purposes.
   * This method should only be used in tests.
   *
   * @param value - The value to generate a key for
   * @param targetValue - The target value to generate a key for
   * @returns A string key that uniquely identifies the value pair
   */
  getCacheKeyForTesting(value: T, targetValue: unknown): string {
    return this.getCacheKey(value, targetValue);
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
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `str:${value}`;
    if (typeof value === 'number') return `num:${value}`;
    if (typeof value === 'boolean') return `bool:${value}`;
    if (value instanceof Date) {
      let referenceId = this.objectReferenceMap.get(value);
      if (!referenceId) {
        referenceId = `ref_${this.nextObjectId++}`;
        this.objectReferenceMap.set(value, referenceId);
      }
      return `date:${referenceId}`;
    }

    // For objects and arrays, use reference-based keys
    if (typeof value === 'object') {
      let referenceId = this.objectReferenceMap.get(value);
      if (!referenceId) {
        referenceId = `ref_${this.nextObjectId++}`;
        this.objectReferenceMap.set(value, referenceId);
      }
      return referenceId;
    }

    return `other:${String(value)}`;
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
  public enableCache(): void {
    this.useCache = true;
  }

  /**
   * Disables caching of evaluation results.
   */
  public disableCache(): void {
    this.useCache = false;
  }

  /**
   * Clears all cached evaluation results.
   */
  public clearCache(): void {
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
