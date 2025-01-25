import { DateBetweenOperator } from '../date-between.operator';

describe('DateBetweenOperator', () => {
  const operator = new DateBetweenOperator();

  it('should return true when date is between start and end dates', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    const range: [Date, Date] = [new Date('2024-01-24T12:00:00Z'), new Date('2024-01-26T12:00:00Z')];
    expect(operator.evaluate(date, range)).toBe(true);
  });

  it('should return true when date equals start or end date', () => {
    const startDate = new Date('2024-01-24T12:00:00Z');
    const endDate = new Date('2024-01-26T12:00:00Z');
    const range: [Date, Date] = [startDate, endDate];

    expect(operator.evaluate(startDate, range)).toBe(true);
    expect(operator.evaluate(endDate, range)).toBe(true);
  });

  it('should return false when date is outside the range', () => {
    const date = new Date('2024-01-23T12:00:00Z');
    const range: [Date, Date] = [new Date('2024-01-24T12:00:00Z'), new Date('2024-01-26T12:00:00Z')];
    expect(operator.evaluate(date, range)).toBe(false);

    const date2 = new Date('2024-01-27T12:00:00Z');
    expect(operator.evaluate(date2, range)).toBe(false);
  });

  it('should handle string dates without time components', () => {
    const date = new Date('2024-01-25T15:30:00Z');
    const range: [string, string] = ['2024-01-24', '2024-01-26'];
    expect(operator.evaluate(date, range)).toBe(true);

    // Even though 15:30 UTC is the next day in some timezones, it should still be considered within the same day
    const range2: [string, string] = ['2024-01-25', '2024-01-25'];
    expect(operator.evaluate(date, range2)).toBe(true);

    const range3: [string, string] = ['2024-01-26', '2024-01-27'];
    expect(operator.evaluate(date, range3)).toBe(false);
  });

  it('should handle mixed date formats (with and without time)', () => {
    const date = new Date('2024-01-25T15:30:00Z');
    const range: [string, string] = ['2024-01-24', '2024-01-25T23:59:59Z'];
    expect(operator.evaluate(date, range)).toBe(true);

    const range2: [string, string] = ['2024-01-25T00:00:00Z', '2024-01-26'];
    expect(operator.evaluate(date, range2)).toBe(true);
  });

  it('should handle time components with millisecond precision', () => {
    const date = new Date('2024-01-25T12:00:00.000Z');
    const range: [string, string] = [
      '2024-01-25T11:59:59.999Z',
      '2024-01-25T12:00:00.001Z'
    ];
    expect(operator.evaluate(date, range)).toBe(true);

    const range2: [string, string] = [
      '2024-01-25T12:00:00.001Z',
      '2024-01-25T12:00:00.002Z'
    ];
    expect(operator.evaluate(date, range2)).toBe(false);
  });

  it('should handle different timezone offsets', () => {
    const date = new Date('2024-01-25T12:00:00+00:00'); // UTC noon
    const range: [string, string] = [
      '2024-01-25T07:00:00-05:00',  // Same time as 12:00 UTC
      '2024-01-25T13:00:00+00:00'
    ];
    expect(operator.evaluate(date, range)).toBe(true);

    const range2: [string, string] = [
      '2024-01-25T13:00:00+00:00',
      '2024-01-25T14:00:00+00:00'
    ];
    expect(operator.evaluate(date, range2)).toBe(false);
  });

  it('should handle edge cases', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    const range: [string, string] = ['2024-01-24', '2024-01-26'];

    expect(operator.evaluate(null as any, range)).toBe(false);
    expect(operator.evaluate(undefined as any, range)).toBe(false);
    expect(operator.evaluate(date, null as any)).toBe(false);
    expect(operator.evaluate(date, undefined as any)).toBe(false);
    expect(operator.evaluate(date, [] as any)).toBe(false);
    expect(operator.evaluate(date, ['2024-01-24'] as any)).toBe(false);
    expect(operator.evaluate({} as any, range)).toBe(false);
    expect(operator.evaluate(new Date('invalid'), range)).toBe(false);
  });

  it('should handle invalid dates', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(date, ['invalid-date', '2024-01-26'])).toBe(false);
    expect(operator.evaluate(date, ['2024-01-24', 'invalid-date'])).toBe(false);
    expect(operator.evaluate(date, ['', ''])).toBe(false);
    expect(operator.evaluate(date, [Object.create(null), '2024-01-26'])).toBe(false);
    expect(operator.evaluate(date, ['2024-01-24', Object.create(null)])).toBe(false);
  });

  describe('caching', () => {
    it('should generate different cache keys for different dates', () => {
      const date1 = new Date('2024-01-25T12:00:00Z');
      const date2 = new Date('2024-01-26T12:00:00Z');
      const range: [string, string] = ['2024-01-24', '2024-01-27'];

      const key1 = operator.getCacheKey(date1, range);
      const key2 = operator.getCacheKey(date2, range);

      expect(key1).not.toBe(key2);
    });

    it('should generate same cache key for same dates', () => {
      const date = new Date('2024-01-25T12:00:00Z');
      const range: [string, string] = ['2024-01-24', '2024-01-27'];

      const key1 = operator.getCacheKey(date, range);
      const key2 = operator.getCacheKey(new Date(date), range);

      expect(key1).toBe(key2);
    });

    it('should generate consistent cache keys for dates without time components', () => {
      const date1 = new Date('2024-01-25T12:00:00Z');
      const date2 = new Date('2024-01-25T15:30:00Z');
      const range: [string, string] = ['2024-01-24', '2024-01-26'];

      const key1 = operator.getCacheKey(date1, range);
      const key2 = operator.getCacheKey(date2, range);

      expect(key1).toBe(key2);
    });

    it('should handle invalid dates in cache key generation', () => {
      const operator = new DateBetweenOperator();
      const invalidDate = new Date('invalid');
      const validDate = new Date('2024-01-25');
      expect(operator.getCacheKey(invalidDate, [validDate, validDate])).toBe('invalid');
      expect(operator.getCacheKey(validDate, [invalidDate, validDate])).toBe('invalid');
      expect(operator.getCacheKey(validDate, [validDate, invalidDate])).toBe('invalid');
    });

    it('should cache evaluation results', () => {
      const date = new Date('2024-01-25T12:00:00Z');
      const range: [string, string] = ['2024-01-24', '2024-01-26'];

      const result1 = operator.evaluate(date, range);
      const result2 = operator.evaluate(date, range);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('should generate cache keys for timestamps', () => {
      const operator = new DateBetweenOperator();
      const value = new Date('2024-01-25T12:00:00Z');
      const start = new Date('2024-01-24T12:00:00Z');
      const end = new Date('2024-01-26T12:00:00Z');
      const expectedKey = `${value.getTime()}-${start.getTime()}-${end.getTime()}`;
      expect(operator.getCacheKey(value, [start, end])).toBe(expectedKey);
    });

    it('should handle errors in date construction', () => {
      const operator = new DateBetweenOperator();
      const value = new Date('2024-01-25');
      
      // Mock Date constructor to throw an error
      const OriginalDate = global.Date;
      const mockDate = function(this: any, ...args: any[]) {
        if (args.length) {
          throw new Error('Mock error');
        }
        return new OriginalDate();
      } as any;
      mockDate.prototype = OriginalDate.prototype;
      global.Date = mockDate;
      
      try {
        expect(operator.getCacheKey(value, ['2024-01-24', '2024-01-26'])).toBe('invalid');
      } finally {
        global.Date = OriginalDate;
      }
    });
  });
}); 