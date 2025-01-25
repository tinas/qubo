import { DateWithinOperator } from '../date-within.operator';

describe('DateWithinOperator', () => {
  const operator = new DateWithinOperator();
  const now = new Date();
  
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return true for dates within the target days', () => {
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    expect(operator.evaluate(twoDaysAgo, { days: 3 })).toBe(true);
    
    const today = new Date(now);
    expect(operator.evaluate(today, { days: 1 })).toBe(true);
  });

  it('should return false for dates outside the target days', () => {
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    expect(operator.evaluate(fiveDaysAgo, { days: 3 })).toBe(false);
  });

  it('should return false for invalid dates', () => {
    expect(operator.evaluate(null as any, { days: 3 })).toBe(false);
    expect(operator.evaluate(undefined as any, { days: 3 })).toBe(false);
    expect(operator.evaluate('not a date' as any, { days: 3 })).toBe(false);
  });

  it('should handle zero and negative days correctly', () => {
    const today = new Date(now);
    expect(operator.evaluate(today, { days: 0 })).toBe(true);
    expect(operator.evaluate(today, { days: -1 })).toBe(false);
  });
}); 