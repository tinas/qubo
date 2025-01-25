import { DateWithinOperator } from '../date-within.operator';

describe('DateWithinOperator', () => {
  const operator = new (DateWithinOperator as any)();

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

  it('should return false for invalid dates', () => {
    expect(operator.evaluate('not a date', { days: 3 })).toBe(false);
  });
}); 