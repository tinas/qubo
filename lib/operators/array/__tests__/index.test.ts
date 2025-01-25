import { arrayOperators } from '..';
import { ArrayLengthOperator } from '../array-length.operator';
import { ArrayContainsOperator } from '../contains.operator';
import { ArrayContainsAllOperator } from '../contains-all.operator';
import { ArrayContainsAnyOperator } from '../contains-any.operator';
import { ArrayEmptyOperator } from '../empty.operator';

describe('Array operators index', () => {
  it('should export all array operators with correct keys', () => {
    expect(arrayOperators.size).toBe(5);
    
    expect(arrayOperators.get('$length')).toBeInstanceOf(ArrayLengthOperator);
    expect(arrayOperators.get('$contains')).toBeInstanceOf(ArrayContainsOperator);
    expect(arrayOperators.get('$containsAll')).toBeInstanceOf(ArrayContainsAllOperator);
    expect(arrayOperators.get('$containsAny')).toBeInstanceOf(ArrayContainsAnyOperator);
    expect(arrayOperators.get('$empty')).toBeInstanceOf(ArrayEmptyOperator);
  });

  it('should export all operator classes', () => {
    expect(ArrayLengthOperator).toBeDefined();
    expect(ArrayContainsOperator).toBeDefined();
    expect(ArrayContainsAllOperator).toBeDefined();
    expect(ArrayContainsAnyOperator).toBeDefined();
    expect(ArrayEmptyOperator).toBeDefined();
  });
}); 