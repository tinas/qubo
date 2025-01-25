import { NotInOperator } from '../not-in.operator';

describe('NotInOperator', () => {
  const operator = new NotInOperator();

  it('should return true when value is not in the target array', () => {
    expect(operator.evaluate(4, [1, 2, 3])).toBe(true);
    expect(operator.evaluate('d', ['a', 'b', 'c'])).toBe(true);
    expect(operator.evaluate(true, [false])).toBe(true);
    expect(operator.evaluate(null, [undefined])).toBe(true);
  });

  it('should return false when value is in the target array', () => {
    expect(operator.evaluate(1, [1, 2, 3])).toBe(false);
    expect(operator.evaluate('a', ['a', 'b', 'c'])).toBe(false);
    expect(operator.evaluate(true, [true, false])).toBe(false);
    expect(operator.evaluate(null, [null, undefined])).toBe(false);
  });

  it('should handle objects and arrays using strict equality', () => {
    const obj = { a: 1 };
    const arr = [1, 2, 3];

    expect(operator.evaluate(obj, [{ a: 1 }, obj])).toBe(false); // Same reference in array
    expect(operator.evaluate(obj, [{ a: 1 }])).toBe(true); // Different reference
    expect(operator.evaluate(arr, [[1, 2, 3], arr])).toBe(false); // Same reference in array
    expect(operator.evaluate(arr, [[1, 2, 3]])).toBe(true); // Different reference
  });

  it('should handle date comparisons', () => {
    const now = new Date();
    const sameTime = new Date(now.getTime());

    expect(operator.evaluate(now, [now])).toBe(false); // Same reference
    expect(operator.evaluate(now, [sameTime])).toBe(true); // Different reference
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(NaN, [NaN])).toBe(false); // Array.includes NaN'ı özel olarak ele alır
    expect(operator.evaluate(0, [-0, 0])).toBe(false);
    expect(operator.evaluate(Infinity, [Infinity])).toBe(false);
    expect(operator.evaluate(-Infinity, [-Infinity])).toBe(false);
  });

  it('should handle invalid target arrays', () => {
    expect(operator.evaluate(1, null as any)).toBe(true);
    expect(operator.evaluate(1, undefined as any)).toBe(true);
    expect(operator.evaluate(1, {} as any)).toBe(true);
    expect(operator.evaluate(1, 'not an array' as any)).toBe(true);
  });

  it('should handle empty arrays', () => {
    expect(operator.evaluate(1, [])).toBe(true);
    expect(operator.evaluate(null, [])).toBe(true);
    expect(operator.evaluate(undefined, [])).toBe(true);
  });
}); 