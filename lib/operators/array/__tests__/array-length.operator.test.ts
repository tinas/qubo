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
}); 