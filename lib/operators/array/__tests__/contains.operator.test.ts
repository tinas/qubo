import { ArrayContainsOperator } from '../contains.operator';

describe('ArrayContainsOperator', () => {
  let operator: ArrayContainsOperator;

  beforeEach(() => {
    operator = new ArrayContainsOperator();
  });

  it('should return true when array contains the target value', () => {
    expect(operator.evaluate([1, 2, 3], 2)).toBe(true);
    expect(operator.evaluate(['a', 'b', 'c'], 'b')).toBe(true);
  });

  it('should return false when array does not contain the target value', () => {
    expect(operator.evaluate([1, 2, 3], 4)).toBe(false);
    expect(operator.evaluate(['a', 'b', 'c'], 'd')).toBe(false);
  });

  it('should handle objects and arrays using strict equality', () => {
    const obj = { a: 1 };
    const arr = [1, 2];
    
    expect(operator.evaluate([obj, { a: 1 }], obj)).toBe(true);
    expect(operator.evaluate([obj], { a: 1 })).toBe(false);
    expect(operator.evaluate([arr, [1, 2]], arr)).toBe(true);
    expect(operator.evaluate([arr], [1, 2])).toBe(false);
  });

  it('should handle date comparisons', () => {
    const date = new Date('2024-01-25');
    const sameDate = new Date('2024-01-25');
    
    expect(operator.evaluate([date], date)).toBe(true);
    expect(operator.evaluate([date], sameDate)).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(null as any, 1)).toBe(false);
    expect(operator.evaluate(undefined as any, 1)).toBe(false);
    expect(operator.evaluate([] as any, 1)).toBe(false);
    expect(operator.evaluate([null], null)).toBe(true);
    expect(operator.evaluate([undefined], undefined)).toBe(true);
  });
}); 