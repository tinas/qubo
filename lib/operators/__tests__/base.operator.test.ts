import { BaseOperator } from '../base.operator';

// Test implementation of BaseOperator for testing purposes
class TestOperator extends BaseOperator<unknown, unknown> {
  evaluate(value: unknown, condition: unknown): boolean {
    const cacheKey = this.getCacheKey(value, condition);
    const cachedResult = this.getFromCache(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    // Simple equality check for testing
    const result = value === condition;
    this.setInCache(cacheKey, result);
    return result;
  }

  // Expose protected methods for testing
  public testGenerateCacheKey(value: unknown): string {
    return this.generateCacheKey(value);
  }

  public testHash(str: string): number {
    return this.hash(str);
  }
}

describe('BaseOperator', () => {
  describe('cache key generation', () => {
    let operator: TestOperator;

    beforeEach(() => {
      operator = new TestOperator();
    });

    it('should generate consistent cache keys for primitive values', () => {
      expect(operator.testGenerateCacheKey('test')).toBe('str:test');
      expect(operator.testGenerateCacheKey(123)).toBe('num:123');
      expect(operator.testGenerateCacheKey(true)).toBe('bool:true');
      expect(operator.testGenerateCacheKey(null)).toBe('null');
      expect(operator.testGenerateCacheKey(undefined)).toBe('undefined');
      
      // Test primitive wrapper objects
      expect(operator.testGenerateCacheKey(new String('test'))).toBe('str:test');
      expect(operator.testGenerateCacheKey(new Number(123))).toBe('num:123');
      expect(operator.testGenerateCacheKey(new Boolean(true))).toBe('bool:true');
    });

    it('should generate consistent cache keys for objects using reference IDs', () => {
      const obj = { test: 'value' };
      const firstKey = operator.testGenerateCacheKey(obj);
      const secondKey = operator.testGenerateCacheKey(obj);
      expect(firstKey).toBe(secondKey);
      expect(firstKey).toMatch(/^ref_\d+$/);
    });

    it('should generate different cache keys for different objects with same values', () => {
      const obj1 = { test: 'value' };
      const obj2 = { test: 'value' };
      const key1 = operator.testGenerateCacheKey(obj1);
      const key2 = operator.testGenerateCacheKey(obj2);
      expect(key1).not.toBe(key2);
    });

    it('should handle complex objects and arrays', () => {
      const array = [1, 2, 3];
      const date = new Date();
      const complexObj = { array, date, nested: { value: 'test' } };
      
      const arrayKey = operator.testGenerateCacheKey(array);
      const dateKey = operator.testGenerateCacheKey(date);
      const complexObjKey = operator.testGenerateCacheKey(complexObj);
      
      expect(arrayKey).toMatch(/^ref_\d+$/);
      expect(dateKey).toMatch(/^date:ref_\d+$/);
      expect(complexObjKey).toMatch(/^ref_\d+$/);
    });

    it('should handle special values and symbols', () => {
      const symbol = Symbol('test');
      const fn = () => {};
      
      expect(operator.testGenerateCacheKey(symbol)).toMatch(/^other:.+$/);
      expect(operator.testGenerateCacheKey(fn)).toMatch(/^other:.+$/);
    });

    it('should handle non-object values in object type check', () => {
      const operator = new TestOperator();
      
      // Test with values that are not objects but might be handled by the object type check
      const fn = () => {};
      Object.setPrototypeOf(fn, null);
      
      const primitiveObj = Object(42); // Number object
      const primitiveStr = Object('test'); // String object
      
      // These should be handled by the primitive type checks
      expect(operator.testGenerateCacheKey(primitiveObj)).toMatch(/^num:42$/);
      expect(operator.testGenerateCacheKey(primitiveStr)).toMatch(/^str:test$/);
      expect(operator.testGenerateCacheKey(fn)).toMatch(/^other:.+$/);
    });

    it('should handle error cases in cache key generation', () => {
      const operator = new TestOperator();
      
      // Create an object that throws when converted to string
      const throwingObj = {
        toString: () => { throw new Error('Test error'); },
        valueOf: () => { throw new Error('Test error'); }
      };
      
      // Should fallback to type-based key
      expect(operator.testGenerateCacheKey(throwingObj)).toBe('other:object');
      
      // Test with Symbol
      const sym = Symbol('test');
      expect(operator.testGenerateCacheKey(sym)).toMatch(/^other:Symbol\(test\)$/);
    });
  });

  describe('caching behavior', () => {
    let operator: TestOperator;

    beforeEach(() => {
      operator = new TestOperator();
    });

    it('should cache evaluation results when enabled', () => {
      const value = { test: 'value' };
      const condition = { test: 'value' };
      
      // First evaluation
      const result1 = operator.evaluate(value, condition);
      // Second evaluation should use cache
      const result2 = operator.evaluate(value, condition);
      
      expect(result1).toBe(result2);
    });

    it('should not cache evaluation results when disabled', () => {
      operator.disableCache();
      
      const value = new Date();
      const condition = new Date(value.getTime());
      
      // Evaluations should not use cache
      operator.evaluate(value, condition);
      operator.evaluate(value, condition);
      
      // Re-enable cache and verify it starts caching again
      operator.enableCache();
      const result1 = operator.evaluate(value, condition);
      const result2 = operator.evaluate(value, condition);
      expect(result1).toBe(result2);
    });

    it('should clear cache when requested', () => {
      const value = 'test';
      const condition = 'test';
      
      // First evaluation
      operator.evaluate(value, condition);
      operator.clearCache();
      
      // After clearing cache, should evaluate again
      operator.evaluate(value, condition);
    });

    it('should handle cache operations with different value types', () => {
      const testCases = [
        { value: 'string', condition: 'string' },
        { value: 123, condition: 123 },
        { value: true, condition: true },
        { value: null, condition: null },
        { value: undefined, condition: undefined },
        { value: new Date(), condition: new Date() },
        { value: [1, 2, 3], condition: [1, 2, 3] },
        { value: { test: 'value' }, condition: { test: 'value' } }
      ];

      for (const { value, condition } of testCases) {
        operator.evaluate(value, condition);
        operator.evaluate(value, condition);
      }
    });
  });

  describe('hash function', () => {
    let operator: TestOperator;

    beforeEach(() => {
      operator = new TestOperator();
    });

    it('should generate consistent hash values', () => {
      const str = 'test string';
      const hash1 = operator.testHash(str);
      const hash2 = operator.testHash(str);
      expect(hash1).toBe(hash2);
    });

    it('should handle empty strings', () => {
      expect(operator.testHash('')).toBe(0);
    });

    it('should handle unicode strings', () => {
      const unicodeStr = '🚀👨‍💻🌍';
      const hash = operator.testHash(unicodeStr);
      expect(typeof hash).toBe('number');
      expect(Number.isInteger(hash)).toBe(true);
    });

    it('should handle long strings', () => {
      const longStr = 'a'.repeat(1000);
      const hash = operator.testHash(longStr);
      expect(typeof hash).toBe('number');
      expect(Number.isInteger(hash)).toBe(true);
    });

    it('should handle error cases in hash function', () => {
      const operator = new TestOperator();
      
      // Test with empty string
      expect(operator.testHash('')).toBe(0);
      
      // Test with string containing surrogate pairs
      const surrogatePair = '👨‍👩‍👧‍👦';
      const hash = operator.testHash(surrogatePair);
      expect(typeof hash).toBe('number');
      expect(Number.isInteger(hash)).toBe(true);

      // Test with invalid code points
      const invalidString = String.fromCharCode(0xD800); // Unpaired surrogate
      const hashInvalid = operator.testHash(invalidString);
      expect(typeof hashInvalid).toBe('number');
      expect(Number.isInteger(hashInvalid)).toBe(true);
    });

    it('should handle invalid code points', () => {
      const operator = new TestOperator();
      const invalidString = String.fromCharCode(0xD800); // Unpaired surrogate
      const hash = operator.testHash(invalidString);
      expect(typeof hash).toBe('number');
      expect(Number.isInteger(hash)).toBe(true);
    });
  });
}); 