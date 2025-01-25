import { InOperator } from '../in.operator';

describe('InOperator', () => {
  const operator = new InOperator();

  it('should return true when value is in the target array', () => {
    expect(operator.evaluate(1, [1, 2, 3])).toBe(true);
    expect(operator.evaluate('a', ['a', 'b', 'c'])).toBe(true);
    expect(operator.evaluate(true, [true, false])).toBe(true);
    expect(operator.evaluate(null, [null, undefined])).toBe(true);
  });

  it('should return false when value is not in the target array', () => {
    expect(operator.evaluate(4, [1, 2, 3])).toBe(false);
    expect(operator.evaluate('d', ['a', 'b', 'c'])).toBe(false);
    expect(operator.evaluate(true, [false])).toBe(false);
    expect(operator.evaluate(null, [undefined])).toBe(false);
  });

  it('should handle objects and arrays using strict equality', () => {
    const obj = { a: 1 };
    const arr = [1, 2, 3];

    expect(operator.evaluate(obj, [{ a: 1 }, obj])).toBe(true); // Same reference in array
    expect(operator.evaluate(obj, [{ a: 1 }])).toBe(false); // Different reference
    expect(operator.evaluate(arr, [[1, 2, 3], arr])).toBe(true); // Same reference in array
    expect(operator.evaluate(arr, [[1, 2, 3]])).toBe(false); // Different reference
  });

  it('should handle date comparisons', () => {
    const now = new Date();
    const sameTime = new Date(now.getTime());

    expect(operator.evaluate(now, [now])).toBe(true); // Same reference
    expect(operator.evaluate(now, [sameTime])).toBe(false); // Different reference
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(NaN, [NaN])).toBe(true); // Array.includes NaN'ı özel olarak ele alır
    expect(operator.evaluate(0, [-0, 0])).toBe(true);
    expect(operator.evaluate(Infinity, [Infinity])).toBe(true);
    expect(operator.evaluate(-Infinity, [-Infinity])).toBe(true);
  });

  it('should handle invalid target arrays', () => {
    expect(operator.evaluate(1, null as any)).toBe(false);
    expect(operator.evaluate(1, undefined as any)).toBe(false);
    expect(operator.evaluate(1, {} as any)).toBe(false);
    expect(operator.evaluate(1, 'not an array' as any)).toBe(false);
  });

  it('should handle empty arrays', () => {
    expect(operator.evaluate(1, [])).toBe(false);
    expect(operator.evaluate(null, [])).toBe(false);
    expect(operator.evaluate(undefined, [])).toBe(false);
  });
}); 