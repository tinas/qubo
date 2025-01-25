import { EqualOperator } from '../equal.operator';

describe('EqualOperator', () => {
  const operator = new EqualOperator();

  it('should return true for equal values', () => {
    expect(operator.evaluate(1, 1)).toBe(true);
    expect(operator.evaluate('test', 'test')).toBe(true);
    expect(operator.evaluate(true, true)).toBe(true);
    expect(operator.evaluate(null, null)).toBe(true);
  });

  it('should return false for different values', () => {
    expect(operator.evaluate(1, 2)).toBe(false);
    expect(operator.evaluate('test', 'other')).toBe(false);
    expect(operator.evaluate(true, false)).toBe(false);
    expect(operator.evaluate(null, undefined)).toBe(false);
  });

  it('should handle objects and arrays correctly', () => {
    const obj = { a: 1 };
    const arr = [1, 2, 3];
    
    expect(operator.evaluate(obj, obj)).toBe(true); // Same reference
    expect(operator.evaluate(obj, { a: 1 })).toBe(false); // Different reference
    expect(operator.evaluate(arr, arr)).toBe(true); // Same reference
    expect(operator.evaluate(arr, [1, 2, 3])).toBe(false); // Different reference
  });
}); 