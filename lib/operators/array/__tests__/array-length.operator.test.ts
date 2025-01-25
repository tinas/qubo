import { ArrayLengthOperator } from '../array-length.operator';

describe('ArrayLengthOperator', () => {
  const operator = new ArrayLengthOperator();

  it('should return true when array length matches target value', () => {
    expect(operator.evaluate([1, 2, 3], 3)).toBe(true);
    expect(operator.evaluate([], 0)).toBe(true);
  });

  it('should return false when array length does not match target value', () => {
    expect(operator.evaluate([1, 2], 3)).toBe(false);
    expect(operator.evaluate([1, 2, 3], 2)).toBe(false);
  });

  it('should return false for non-array values', () => {
    // @ts-expect-error
    expect(operator.evaluate('not an array', 3)).toBe(false);
    // @ts-expect-error
    expect(operator.evaluate(null, 0)).toBe(false);
    // @ts-expect-error
    expect(operator.evaluate(undefined, 0)).toBe(false);
  });

  describe('caching', () => {
    it('should generate different cache keys for different array lengths', () => {
      const key1 = operator.getCacheKeyForTesting([1, 2, 3], 3);
      const key2 = operator.getCacheKeyForTesting([1, 2], 3);
      expect(key1).not.toBe(key2);
    });

    it('should generate same cache key for arrays with same length', () => {
      const key1 = operator.getCacheKeyForTesting([1, 2, 3], 3);
      const key2 = operator.getCacheKeyForTesting(['a', 'b', 'c'], 3);
      expect(key1).toBe(key2);
    });

    it('should handle non-array values in cache key generation', () => {
      // @ts-expect-error
      const key1 = operator.getCacheKeyForTesting('not an array', 3);
      // @ts-expect-error
      const key2 = operator.getCacheKeyForTesting(null, 3);
      // @ts-expect-error
      const key3 = operator.getCacheKeyForTesting(undefined, 3);

      expect(key1).toBe('not-array-3');
      expect(key2).toBe('not-array-3');
      expect(key3).toBe('not-array-3');
    });
  });
}); 