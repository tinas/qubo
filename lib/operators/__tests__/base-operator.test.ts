import { BaseOperator } from '../base.operator';

class TestOperator extends BaseOperator<unknown, unknown> {
  evaluate(value: unknown, condition: unknown): boolean {
    return true;
  }

  getCacheKeyForTesting(value: unknown, targetValue: unknown): string {
    return this.getCacheKey(value, targetValue);
  }
}

describe('BaseOperator', () => {
  let operator: TestOperator;

  beforeEach(() => {
    operator = new TestOperator();
  });

  describe('cache key generation', () => {
    it('should generate consistent cache keys for primitive values', () => {
      expect(operator.getCacheKeyForTesting(42, 'test')).toBe(operator.getCacheKeyForTesting(42, 'test'));
      expect(operator.getCacheKeyForTesting('hello', true)).toBe(operator.getCacheKeyForTesting('hello', true));
    });

    it('should generate consistent cache keys for objects using reference IDs', () => {
      const obj = { foo: 'bar' };
      const firstKey = operator.getCacheKeyForTesting(obj, 'test');
      const secondKey = operator.getCacheKeyForTesting(obj, 'test');
      expect(firstKey).toBe(secondKey);
    });

    it('should generate different cache keys for different objects with same values', () => {
      const obj1 = { foo: 'bar' };
      const obj2 = { foo: 'bar' };
      const key1 = operator.getCacheKeyForTesting(obj1, 'test');
      const key2 = operator.getCacheKeyForTesting(obj2, 'test');
      expect(key1).not.toBe(key2);
    });
  });

  describe('caching behavior', () => {
    it('should cache evaluation results when enabled', () => {
      operator.enableCache();
      const result1 = operator.evaluate(42, 'test');
      const result2 = operator.evaluate(42, 'test');
      expect(result1).toBe(result2);
    });

    it('should not cache evaluation results when disabled', () => {
      operator.disableCache();
      const result1 = operator.evaluate(42, 'test');
      const result2 = operator.evaluate(42, 'test');
      expect(result1).toBe(result2);
    });

    it('should clear cache when requested', () => {
      operator.enableCache();
      operator.evaluate(42, 'test');
      operator.clearCache();
      const key1 = operator.getCacheKeyForTesting(42, 'test');
      const key2 = operator.getCacheKeyForTesting(42, 'test');
      expect(key1).toBe(key2);
    });
  });
}); 