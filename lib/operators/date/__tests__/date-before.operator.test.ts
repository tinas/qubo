import { DateBeforeOperator } from '../date-before.operator';

describe('DateBeforeOperator', () => {
  const operator = new DateBeforeOperator();

  it('should return true when date is before target date', () => {
    const date = new Date('2024-01-24T12:00:00Z');
    const targetDate = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(date, targetDate)).toBe(true);
  });

  it('should return false when date is after target date', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    const targetDate = new Date('2024-01-24T12:00:00Z');
    expect(operator.evaluate(date, targetDate)).toBe(false);
  });

  it('should return false when date equals target date', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    const targetDate = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(date, targetDate)).toBe(false);
  });

  it('should handle string dates in different formats', () => {
    const date = new Date('2024-01-24T12:00:00Z');
    expect(operator.evaluate(date, '2024-01-25')).toBe(true);
    expect(operator.evaluate(date, '2024-01-25T12:00:00Z')).toBe(true);
    expect(operator.evaluate(date, '2024-01-25T12:00:00+00:00')).toBe(true);
    expect(operator.evaluate(date, '2024-01-24')).toBe(false);
    expect(operator.evaluate(date, '2024-01-23')).toBe(false);
  });

  it('should handle time components with millisecond precision', () => {
    const date = new Date('2024-01-25T12:00:00.000Z');
    expect(operator.evaluate(date, '2024-01-25T12:00:00.001Z')).toBe(true);
    expect(operator.evaluate(date, '2024-01-25T12:00:00.000Z')).toBe(false);
    expect(operator.evaluate(date, '2024-01-25T11:59:59.999Z')).toBe(false);
  });

  it('should handle different timezone offsets', () => {
    const date = new Date('2024-01-25T12:00:00Z'); // UTC noon
    expect(operator.evaluate(date, '2024-01-25T12:00:01+00:00')).toBe(true); // Just after UTC noon
    expect(operator.evaluate(date, '2024-01-25T11:00:00+01:00')).toBe(false); // Before UTC noon
    expect(operator.evaluate(date, '2024-01-25T07:00:00-05:00')).toBe(false); // Same as UTC noon
  });

  it('should handle invalid dates', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(date, 'invalid-date')).toBe(false);
    expect(operator.evaluate(date, '')).toBe(false);
    expect(operator.evaluate(new Date('invalid'), '2024-01-24')).toBe(false);
    expect(operator.evaluate(date, new Date('invalid'))).toBe(false);
  });

  it('should handle edge cases', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(null as any, '2024-01-24')).toBe(false);
    expect(operator.evaluate(undefined as any, '2024-01-24')).toBe(false);
    expect(operator.evaluate(date, null as any)).toBe(false);
    expect(operator.evaluate(date, undefined as any)).toBe(false);
    expect(operator.evaluate({} as any, '2024-01-24')).toBe(false);
    expect(operator.evaluate(date, {} as any)).toBe(false);
  });

  describe('caching', () => {
    it('should generate different cache keys for different dates', () => {
      const date1 = new Date('2024-01-25T12:00:00Z');
      const date2 = new Date('2024-01-24T12:00:00Z');
      const target = new Date('2024-01-26T12:00:00Z');

      const key1 = operator.getCacheKeyForTesting(date1, target);
      const key2 = operator.getCacheKeyForTesting(date2, target);

      expect(key1).not.toBe(key2);
    });

    it('should generate same cache key for same dates', () => {
      const date = new Date('2024-01-25T12:00:00Z');
      const target1 = new Date('2024-01-26T12:00:00Z');
      const target2 = '2024-01-26T12:00:00Z';

      const key1 = operator.getCacheKeyForTesting(date, target1);
      const key2 = operator.getCacheKeyForTesting(date, target2);

      expect(key1).toBe(key2);
    });

    it('should handle invalid dates in cache key generation', () => {
      const date = new Date('2024-01-25T12:00:00Z');
      
      expect(operator.getCacheKeyForTesting(null as any, date)).toBe('invalid');
      expect(operator.getCacheKeyForTesting(date, 'invalid-date')).toBe('invalid');
      expect(operator.getCacheKeyForTesting(new Date('invalid'), date)).toBe('invalid');
    });

    it('should cache evaluation results', () => {
      const date = new Date('2024-01-24T12:00:00Z');
      const target = new Date('2024-01-25T12:00:00Z');

      const result1 = operator.evaluate(date, target);
      const result2 = operator.evaluate(date, target);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });
  });

  it('should handle errors in date parsing', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    // Create a string that will throw an error when parsed
    const malformedDate = { toString: () => { throw new Error('Parse error'); } };
    expect(operator.getCacheKeyForTesting(date, malformedDate as any)).toBe('invalid');
  });
}); 