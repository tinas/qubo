import { GreaterThanEqualOperator } from '../greater-than-equal.operator';

describe('GreaterThanEqualOperator', () => {
  const operator = new GreaterThanEqualOperator();

  it('should return true when value is greater than target', () => {
    expect(operator.evaluate(5, 3)).toBe(true);
    expect(operator.evaluate(0, -1)).toBe(true);
    expect(operator.evaluate(10.5, 10)).toBe(true);
  });

  it('should return true when value is equal to target', () => {
    expect(operator.evaluate(5, 5)).toBe(true);
    expect(operator.evaluate(0, 0)).toBe(true);
    expect(operator.evaluate(-1, -1)).toBe(true);
    expect(operator.evaluate(10.5, 10.5)).toBe(true);
  });

  it('should return false when value is less than target', () => {
    expect(operator.evaluate(3, 5)).toBe(false);
    expect(operator.evaluate(-1, 0)).toBe(false);
    expect(operator.evaluate(10, 10.5)).toBe(false);
  });

  it('should handle string comparisons', () => {
    expect(operator.evaluate('b', 'a')).toBe(true);
    expect(operator.evaluate('a', 'a')).toBe(true);
    expect(operator.evaluate('zoo', 'zebra')).toBe(true);
    expect(operator.evaluate('zebra', 'zebra')).toBe(true);
    expect(operator.evaluate('a', 'b')).toBe(false);
  });

  it('should handle date comparisons', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 1000);
    const future = new Date(now.getTime() + 1000);
    const sameTime = new Date(now.getTime());

    expect(operator.evaluate(future, now)).toBe(true);
    expect(operator.evaluate(now, past)).toBe(true);
    expect(operator.evaluate(now, sameTime)).toBe(true);
    expect(operator.evaluate(past, future)).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(Infinity, 100)).toBe(true);
    expect(operator.evaluate(Infinity, Infinity)).toBe(true);
    expect(operator.evaluate(100, Infinity)).toBe(false);
    expect(operator.evaluate(NaN, 1)).toBe(false);
    expect(operator.evaluate(1, NaN)).toBe(false);
    expect(operator.evaluate(NaN, NaN)).toBe(false);
  });
}); 