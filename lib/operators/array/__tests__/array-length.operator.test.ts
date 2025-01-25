import { ArrayLengthOperator } from '../array-length.operator';

describe('ArrayLengthOperator', () => {
  const operator = new ArrayLengthOperator();

  it('should return true when array length matches target value', () => {
    expect(operator.evaluate([1, 2, 3], 3)).toBe(true);
    expect(operator.evaluate([], 0)).toBe(true);
    expect(operator.evaluate(['a'], 1)).toBe(true);
  });

  it('should return false when array length does not match target value', () => {
    expect(operator.evaluate([1, 2], 3)).toBe(false);
    expect(operator.evaluate([1], 0)).toBe(false);
    expect(operator.evaluate([], 1)).toBe(false);
  });

  it('should return false for non-array values', () => {
    expect(operator.evaluate(null as any, 0)).toBe(false);
    expect(operator.evaluate(undefined as any, 0)).toBe(false);
    expect(operator.evaluate({} as any, 0)).toBe(false);
    expect(operator.evaluate('test' as any, 4)).toBe(false);
  });
}); 