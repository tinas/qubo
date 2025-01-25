import type { IOperator } from '../operator.types';
import { LRUCache } from '../utils/lru-cache';

export interface BaseOperatorOptions {
  cacheSize?: number;
  enableCache?: boolean;
}

export abstract class BaseOperator<TValue, TTarget> implements IOperator<TValue, TTarget> {
  private cache: LRUCache<string, boolean>;
  private cacheEnabled: boolean;

  constructor(options: BaseOperatorOptions = {}) {
    this.cacheEnabled = options.enableCache ?? true;
    this.cache = new LRUCache<string, boolean>(options.cacheSize);
  }

  evaluate(value: TValue, targetValue: TTarget): boolean {
    if (!this.cacheEnabled) {
      return this.evaluateInternal(value, targetValue);
    }

    const cacheKey = this.getCacheKey(value, targetValue);
    const cachedResult = this.cache.get(cacheKey);
    
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const result = this.evaluateInternal(value, targetValue);
    this.cache.set(cacheKey, result);
    return result;
  }

  protected abstract evaluateInternal(value: TValue, targetValue: TTarget): boolean;

  protected getCacheKey(value: TValue, targetValue: TTarget): string {
    return `${this.getValueKey(value)}-${this.getTargetKey(targetValue)}`;
  }

  protected getValueKey(value: TValue): string {
    if (value instanceof Date) {
      return value.getTime().toString();
    }
    if (Array.isArray(value)) {
      // For arrays, only use length in cache key to save memory
      return `array:${value.length}`;
    }
    if (typeof value === 'object' && value !== null) {
      // For objects, use constructor name and a hash of properties
      return `${value.constructor.name}:${this.objectHash(value)}`;
    }
    return String(value);
  }

  protected getTargetKey(targetValue: TTarget): string {
    if (targetValue instanceof Date) {
      return targetValue.getTime().toString();
    }
    if (Array.isArray(targetValue)) {
      // For arrays, use length and first few elements
      return `array:${targetValue.length}:${targetValue.slice(0, 3).join(',')}`;
    }
    if (typeof targetValue === 'object' && targetValue !== null) {
      return `${targetValue.constructor.name}:${this.objectHash(targetValue)}`;
    }
    return String(targetValue);
  }

  private objectHash(obj: object): string {
    const keys = Object.keys(obj).sort();
    let hash = 0;
    
    for (const key of keys) {
      const value = (obj as any)[key];
      const str = `${key}:${value}`;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
      }
    }

    return hash.toString(36);
  }

  clearCache(): void {
    this.cache.clear();
  }

  enableCache(): void {
    this.cacheEnabled = true;
  }

  disableCache(): void {
    this.cacheEnabled = false;
    this.clearCache();
  }
} 