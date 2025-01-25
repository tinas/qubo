import { NotEqualOperator } from '../not-equal.operator';

describe('NotEqualOperator', () => {
  const operator = new NotEqualOperator();

  it('should return true when values are different', () => {
    expect(operator.evaluate(1, 2)).toBe(true);
    expect(operator.evaluate('a', 'b')).toBe(true);
    expect(operator.evaluate(true, false)).toBe(true);
    expect(operator.evaluate(null, undefined)).toBe(true);
  });

  it('should return false when values are equal', () => {
    expect(operator.evaluate(1, 1)).toBe(false);
    expect(operator.evaluate('a', 'a')).toBe(false);
    expect(operator.evaluate(true, true)).toBe(false);
    expect(operator.evaluate(null, null)).toBe(false);
    expect(operator.evaluate(undefined, undefined)).toBe(false);
  });

  it('should handle strict equality for objects and arrays', () => {
    const obj = { a: 1 };
    const arr = [1, 2, 3];

    expect(operator.evaluate(obj, { a: 1 })).toBe(true); // Different object references
    expect(operator.evaluate(arr, [1, 2, 3])).toBe(true); // Different array references
    expect(operator.evaluate(obj, obj)).toBe(false); // Same reference
    expect(operator.evaluate(arr, arr)).toBe(false); // Same reference
  });

  it('should handle date comparisons', () => {
    const now = new Date();
    const sameTime = new Date(now.getTime());
    const different = new Date(now.getTime() + 1000);

    expect(operator.evaluate(now, different)).toBe(true);
    expect(operator.evaluate(now, now)).toBe(false); // Same reference
    expect(operator.evaluate(now, sameTime)).toBe(true); // Different reference, same time
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(0, -0)).toBe(false); // JavaScript considers 0 and -0 equal
    expect(operator.evaluate(NaN, NaN)).toBe(true); // NaN is never equal to NaN
    expect(operator.evaluate(Infinity, Infinity)).toBe(false);
    expect(operator.evaluate(-Infinity, -Infinity)).toBe(false);
    expect(operator.evaluate(Infinity, -Infinity)).toBe(true);
  });

  it('should handle type coercion cases', () => {
    expect(operator.evaluate('1', 1)).toBe(true); // No type coercion
    expect(operator.evaluate(true, 1)).toBe(true); // No type coercion
    expect(operator.evaluate(false, 0)).toBe(true); // No type coercion
    expect(operator.evaluate('', false)).toBe(true); // No type coercion
  });
}); 