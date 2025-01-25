import { ArrayEmptyOperator } from '../empty.operator';

describe('ArrayEmptyOperator', () => {
  let operator: ArrayEmptyOperator;

  beforeEach(() => {
    operator = new ArrayEmptyOperator();
  });

  it('should return true when array is empty', () => {
    expect(operator.evaluate([])).toBe(true);
  });

  it('should return false when array is not empty', () => {
    expect(operator.evaluate([1])).toBe(false);
    expect(operator.evaluate(['a'])).toBe(false);
    expect(operator.evaluate([null])).toBe(false);
    expect(operator.evaluate([undefined])).toBe(false);
    expect(operator.evaluate([{}])).toBe(false);
    expect(operator.evaluate([[]])).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(null as any)).toBe(false);
    expect(operator.evaluate(undefined as any)).toBe(false);
    expect(operator.evaluate({} as any)).toBe(false);
    expect(operator.evaluate('[]' as any)).toBe(false);
  });
}); 