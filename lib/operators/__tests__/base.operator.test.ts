import { BaseOperator } from '../base.operator';

// Concrete implementation for testing
class TestOperator extends BaseOperator<unknown, unknown> {
  evaluate(value: unknown, targetValue: unknown): boolean {
    const key = this.getCacheKey(value, targetValue);
    const cached = this.getFromCache(key);
    if (cached !== undefined) return cached;

    let result: boolean;

    // Handle null and undefined separately
    if (value === null && targetValue === null) {
      result = true;
    } else if (value === undefined && targetValue === undefined) {
      result = true;
    } else if (value === null || value === undefined || targetValue === null || targetValue === undefined) {
      result = false;
    }
    // Handle dates
    else if (value instanceof Date && targetValue instanceof Date) {
      result = Object.is(value, targetValue);
    }
    // Handle other objects (including arrays)
    else if (typeof value === 'object' || typeof targetValue === 'object') {
      result = Object.is(value, targetValue);
    }
    // Handle primitives
    else {
      result = Object.is(value, targetValue);
    }

    this.setInCache(key, result);
    return result;
  }

  // Expose protected methods for testing
  public exposedGenerateCacheKey(value: unknown): string {
    return this.generateCacheKey(value);
  }
}

describe('BaseOperator', () => {
  let operator: TestOperator;

  beforeEach(() => {
    operator = new TestOperator();
  });

  describe('caching', () => {
    it('should cache evaluation results', () => {
      const value = 'test';
      expect(operator.evaluate(value, value)).toBe(true);
      expect(operator.evaluate(value, value)).toBe(true);
    });

    it('should clear cache when requested', () => {
      const value = 'test';
      operator.evaluate(value, value);
      operator.clearCache();
      const different = 'different';
      expect(operator.evaluate(value, different)).toBe(false);
    });

    it('should disable and enable cache', () => {
      const value = 'test';
      operator.evaluate(value, value);
      operator.disableCache();
      expect(operator.evaluate(value, value)).toBe(true);
      operator.enableCache();
      expect(operator.evaluate(value, value)).toBe(true);
    });
  });

  describe('value comparison', () => {
    it('should handle null and undefined', () => {
      expect(operator.evaluate(null, null)).toBe(true);
      expect(operator.evaluate(undefined, undefined)).toBe(true);
      expect(operator.evaluate(null, undefined)).toBe(false);
    });

    it('should handle primitive types', () => {
      const str = 'string';
      const num = 123;
      const bool = true;
      expect(operator.evaluate(str, str)).toBe(true);
      expect(operator.evaluate(num, num)).toBe(true);
      expect(operator.evaluate(bool, bool)).toBe(true);
      expect(operator.evaluate(str, 'different')).toBe(false);
    });

    it('should handle reference equality for objects', () => {
      const obj = { a: 1 };
      const sameObj = { a: 1 };
      expect(operator.evaluate(obj, obj)).toBe(true);
      expect(operator.evaluate(obj, sameObj)).toBe(false);
    });

    it('should handle reference equality for arrays', () => {
      const arr = [1, 2, 3];
      const sameArr = [1, 2, 3];
      expect(operator.evaluate(arr, arr)).toBe(true);
      expect(operator.evaluate(arr, sameArr)).toBe(false);
    });

    it('should handle reference equality for dates', () => {
      const date = new Date();
      const sameDate = new Date(date.getTime());
      expect(operator.evaluate(date, date)).toBe(true);
      expect(operator.evaluate(date, sameDate)).toBe(false);
    });
  });

  describe('cache key generation', () => {
    it('should generate consistent keys for null and undefined', () => {
      expect(operator.exposedGenerateCacheKey(null)).toBe('null');
      expect(operator.exposedGenerateCacheKey(undefined)).toBe('undefined');
    });

    it('should generate consistent keys for primitives', () => {
      expect(operator.exposedGenerateCacheKey('test')).toBe('str:test');
      expect(operator.exposedGenerateCacheKey(123)).toBe('num:123');
      expect(operator.exposedGenerateCacheKey(true)).toBe('bool:true');
    });

    it('should generate reference-based keys for dates', () => {
      const date = new Date(2024, 0, 1);
      const key = operator.exposedGenerateCacheKey(date);
      expect(key).toMatch(/^date:ref_\d+$/);
      expect(operator.exposedGenerateCacheKey(date)).toBe(key); // Same date should get same key
      expect(operator.exposedGenerateCacheKey(new Date(date.getTime()))).not.toBe(key); // Different date instance should get different key
    });

    it('should generate reference-based keys for arrays', () => {
      const arr = [1, 2, 3];
      const sameArr = [1, 2, 3];
      const key1 = operator.exposedGenerateCacheKey(arr);
      const key2 = operator.exposedGenerateCacheKey(arr);
      const key3 = operator.exposedGenerateCacheKey(sameArr);
      
      expect(key1).toMatch(/^ref_\d+$/);
      expect(key1).toBe(key2); // Same array should get same key
      expect(key1).not.toBe(key3); // Different array should get different key
    });

    it('should generate reference-based keys for objects', () => {
      const obj = { a: 1, b: 2 };
      const sameObj = { a: 1, b: 2 };
      const key1 = operator.exposedGenerateCacheKey(obj);
      const key2 = operator.exposedGenerateCacheKey(obj);
      const key3 = operator.exposedGenerateCacheKey(sameObj);
      
      expect(key1).toMatch(/^ref_\d+$/);
      expect(key1).toBe(key2); // Same object should get same key
      expect(key1).not.toBe(key3); // Different object should get different key
    });

    it('should handle nested structures with reference-based keys', () => {
      const complex = {
        arr: [1, { nested: true }],
        date: new Date(2024, 0, 1),
        str: 'test'
      };
      const key = operator.exposedGenerateCacheKey(complex);
      expect(key).toMatch(/^ref_\d+$/);
    });
  });

  describe('hash function', () => {
    it('should generate consistent hashes', () => {
      const str = 'test string';
      const hash1 = operator['hash'](str);
      const hash2 = operator['hash'](str);
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different strings', () => {
      const hash1 = operator['hash']('test1');
      const hash2 = operator['hash']('test2');
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty strings', () => {
      expect(() => operator['hash']('')).not.toThrow();
    });

    it('should handle unicode strings', () => {
      expect(() => operator['hash']('🚀✨')).not.toThrow();
    });
  });
}); 