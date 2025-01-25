import { DateWithinOperator } from '../date-within.operator';

describe('DateWithinOperator', () => {
  const operator = new DateWithinOperator();

  it('should return true for dates within the specified days', () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(operator.evaluate(twoDaysAgo, { days: 3 })).toBe(true);
  });

  it('should return false for dates outside the specified days', () => {
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    expect(operator.evaluate(fiveDaysAgo, { days: 3 })).toBe(false);
  });

  it('should handle exact boundary cases', () => {
    const now = new Date();
    const exactDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    expect(operator.evaluate(exactDaysAgo, { days: 3 })).toBe(true);
    
    const justOverDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 - 1);
    expect(operator.evaluate(justOverDaysAgo, { days: 3 })).toBe(false);
  });

  it('should handle future dates', () => {
    const now = new Date();
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    expect(operator.evaluate(twoDaysLater, { days: 3 })).toBe(true);
    
    const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    expect(operator.evaluate(fiveDaysLater, { days: 3 })).toBe(false);
  });

  it('should handle negative days', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(operator.evaluate(yesterday, { days: -1 })).toBe(false);
  });

  it('should handle zero days', () => {
    const now = new Date();
    expect(operator.evaluate(now, { days: 0 })).toBe(true);
    
    const oneSecondAgo = new Date(now.getTime() - 1000);
    expect(operator.evaluate(oneSecondAgo, { days: 0 })).toBe(false);
  });

  it('should return false for invalid dates', () => {
    // @ts-expect-error
    expect(operator.evaluate('not a date', { days: 3 })).toBe(false);
    expect(operator.evaluate(new Date('invalid'), { days: 3 })).toBe(false);
    expect(operator.evaluate(null as any, { days: 3 })).toBe(false);
    expect(operator.evaluate(undefined as any, { days: 3 })).toBe(false);
  });

  it('should handle invalid target values', () => {
    const now = new Date();
    expect(operator.evaluate(now, null as any)).toBe(false);
    expect(operator.evaluate(now, undefined as any)).toBe(false);
    expect(operator.evaluate(now, {} as any)).toBe(false);
    expect(operator.evaluate(now, { days: NaN })).toBe(false);
  });

  describe('caching', () => {
    it('should generate different cache keys for different dates', () => {
      const now = new Date();
      const date1 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const date2 = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      
      const key1 = operator.getCacheKeyForTesting(date1, { days: 3 });
      const key2 = operator.getCacheKeyForTesting(date2, { days: 3 });
      
      expect(key1).not.toBe(key2);
    });

    it('should generate different cache keys for different target days', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const key1 = operator.getCacheKeyForTesting(date, { days: 3 });
      const key2 = operator.getCacheKeyForTesting(date, { days: 5 });
      
      expect(key1).not.toBe(key2);
    });

    it('should handle invalid dates in cache key generation', () => {
      const key = operator.getCacheKeyForTesting(null as any, { days: 3 });
      expect(key).toBe('invalid');
    });

    it('should handle undefined target value in cache key generation', () => {
      const date = new Date();
      const key = operator.getCacheKeyForTesting(date, undefined as any);
      expect(key).toBe(`${date.getTime()}-invalid-${new Date().toDateString()}`);
    });
  });
}); 