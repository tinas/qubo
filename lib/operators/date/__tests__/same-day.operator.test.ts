import { SameDayOperator } from '../same-day.operator';

describe('SameDayOperator', () => {
  const operator = new SameDayOperator();

  it('should return true when dates are on the same UTC day regardless of time', () => {
    const date1 = new Date('2024-01-25T00:00:00Z');
    const date2 = new Date('2024-01-25T23:59:59Z');
    expect(operator.evaluate(date1, date2)).toBe(true);
  });

  it('should return false when dates are on different UTC days', () => {
    const date = new Date('2024-01-25T23:59:59Z');
    const targetDate = new Date('2024-01-26T00:00:00Z');
    expect(operator.evaluate(date, targetDate)).toBe(false);
  });

  it('should handle string dates in different formats', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(date, '2024-01-25')).toBe(true);
    expect(operator.evaluate(date, '2024-01-25T00:00:00Z')).toBe(true);
    expect(operator.evaluate(date, '2024-01-25T23:59:59Z')).toBe(true);
    expect(operator.evaluate(date, '2024-01-26T00:00:00Z')).toBe(false);
  });

  it('should handle dates with different timezone offsets correctly', () => {
    // All these dates represent the same UTC day (2024-01-25)
    const utcDate = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(utcDate, '2024-01-25T00:00:00-12:00')).toBe(true); // UTC-12
    expect(operator.evaluate(utcDate, '2024-01-25T20:00:00+08:00')).toBe(true); // UTC+8
    expect(operator.evaluate(utcDate, '2024-01-26T02:00:00+14:00')).toBe(true); // UTC+14
  });

  it('should handle UTC day boundaries correctly', () => {
    const date = new Date('2024-01-25T00:00:00Z');
    
    // These dates are on different UTC days
    expect(operator.evaluate(date, '2024-01-24T23:59:59Z')).toBe(false);
    expect(operator.evaluate(date, '2024-01-25T00:00:00Z')).toBe(true);
    expect(operator.evaluate(date, '2024-01-25T23:59:59Z')).toBe(true);
    expect(operator.evaluate(date, '2024-01-26T00:00:00Z')).toBe(false);
  });

  it('should handle month and year boundaries', () => {
    const lastDayOfMonth = new Date('2024-01-31T23:59:59Z');
    expect(operator.evaluate(lastDayOfMonth, '2024-01-31T00:00:00Z')).toBe(true);
    expect(operator.evaluate(lastDayOfMonth, '2024-02-01T00:00:00Z')).toBe(false);

    const lastDayOfYear = new Date('2024-12-31T23:59:59Z');
    expect(operator.evaluate(lastDayOfYear, '2024-12-31T00:00:00Z')).toBe(true);
    expect(operator.evaluate(lastDayOfYear, '2025-01-01T00:00:00Z')).toBe(false);
  });

  it('should handle edge cases and invalid inputs', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(date, '' as any)).toBe(false);
    expect(operator.evaluate(date, null as any)).toBe(false);
    expect(operator.evaluate(date, undefined as any)).toBe(false);
    expect(operator.evaluate(null as any, '2024-01-25')).toBe(false);
    expect(operator.evaluate(undefined as any, '2024-01-25')).toBe(false);
    expect(operator.evaluate(date, 'invalid-date')).toBe(false);
    expect(operator.evaluate(date, '2024-13-45')).toBe(false);
  });

  it('should handle errors in date parsing', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    // Create a string that will throw an error when parsed
    const malformedDate = { toString: () => { throw new Error('Parse error'); } };
    expect(operator.evaluate(date, malformedDate as any)).toBe(false);
  });
}); 