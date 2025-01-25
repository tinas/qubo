import type { IOperator } from '../operator.types';

export abstract class BaseOperator implements IOperator {
  private cache = new Map<string, boolean>();
  private useCache = true;

  abstract evaluate(value: unknown, targetValue: unknown): boolean;

  protected getCacheKey(value: unknown, targetValue: unknown): string {
    return this.generateCacheKey(value) + '-' + this.generateCacheKey(targetValue);
  }

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

  private generateArrayKey(array: unknown[]): string {
    if (array.length === 0) return '[]';
    return `[${array.slice(0, 3).map((item) => this.generateCacheKey(item)).join(',')}]`;
  }

  private generateObjectKey(object: Record<string, unknown>): string {
    const keys = Object.keys(object).sort();
    if (keys.length === 0) return '{}';
    return `{${keys.map((key) => `${key}:${this.generateCacheKey(object[key])}`).join(',')}}`;
  }

  protected hash(string_: string): number {
    let hash = 0;
    for (let index = 0; index < string_.length; index++) {
      const code = string_.codePointAt(index) ?? 0;
      hash = ((hash << 5) - hash) + code;
      hash = Math.trunc(hash);
    }
    return hash;
  }

  enableCache(): void {
    this.useCache = true;
  }

  disableCache(): void {
    this.useCache = false;
  }

  clearCache(): void {
    this.cache.clear();
  }

  protected getFromCache(key: string): boolean | undefined {
    if (!this.useCache) return undefined;
    return this.cache.get(key);
  }

  protected setInCache(key: string, value: boolean): void {
    if (!this.useCache) return;
    this.cache.set(key, value);
  }
}
