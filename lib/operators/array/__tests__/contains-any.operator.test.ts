import { ArrayContainsAnyOperator } from '../contains-any.operator';

describe('ArrayContainsAnyOperator', () => {
  let operator: ArrayContainsAnyOperator;

  beforeEach(() => {
    operator = new ArrayContainsAnyOperator();
  });

  it('should return true when array contains any of the target values', () => {
    expect(operator.evaluate([1, 2, 3], [1, 4])).toBe(true);
    expect(operator.evaluate(['a', 'b', 'c'], ['c', 'd'])).toBe(true);
    expect(operator.evaluate([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('should return false when array contains none of the target values', () => {
    expect(operator.evaluate([1, 2, 3], [4, 5])).toBe(false);
    expect(operator.evaluate(['a', 'b'], ['c', 'd'])).toBe(false);
    expect(operator.evaluate([], [1, 2, 3])).toBe(false);
  });

  it('should handle objects and arrays using strict equality', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    const arr1 = [1, 2];
    const arr2 = [3, 4];
    
    expect(operator.evaluate([obj1, obj2], [obj1, { c: 3 }])).toBe(true);
    expect(operator.evaluate([obj1], [{ a: 1 }, { b: 2 }])).toBe(false);
    expect(operator.evaluate([arr1, arr2], [arr1, [5, 6]])).toBe(true);
    expect(operator.evaluate([arr1], [[1, 2], [3, 4]])).toBe(false);
  });

  it('should handle date comparisons', () => {
    const date1 = new Date('2024-01-25');
    const date2 = new Date('2024-01-26');
    const sameDate1 = new Date('2024-01-25');
    
    expect(operator.evaluate([date1, date2], [date1, new Date()])).toBe(true);
    expect(operator.evaluate([date1], [sameDate1])).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(null as any, [1])).toBe(false);
    expect(operator.evaluate(undefined as any, [1])).toBe(false);
    expect(operator.evaluate([] as any, [1])).toBe(false);
    expect(operator.evaluate([1, 2, 3], null as any)).toBe(false);
    expect(operator.evaluate([1, 2, 3], undefined as any)).toBe(false);
    expect(operator.evaluate([1, 2, 3], [] as any)).toBe(false);
    expect(operator.evaluate([null], [null, 1])).toBe(true);
    expect(operator.evaluate([undefined], [undefined, 1])).toBe(true);
  });
}); 