import { stringOperators } from '..';
import { ContainsOperator } from '../contains.operator';
import { StartsWithOperator } from '../starts-with.operator';
import { EndsWithOperator } from '../ends-with.operator';
import { RegexOperator } from '../regex.operator';
import { StringLengthOperator } from '../length.operator';

describe('String operators index', () => {
  it('should export all string operators with correct keys', () => {
    expect(stringOperators.size).toBe(5);
    
    expect(stringOperators.get('$contains')).toBeInstanceOf(ContainsOperator);
    expect(stringOperators.get('$startsWith')).toBeInstanceOf(StartsWithOperator);
    expect(stringOperators.get('$endsWith')).toBeInstanceOf(EndsWithOperator);
    expect(stringOperators.get('$regex')).toBeInstanceOf(RegexOperator);
    expect(stringOperators.get('$length')).toBeInstanceOf(StringLengthOperator);
  });

  it('should export all operator classes', () => {
    expect(ContainsOperator).toBeDefined();
    expect(StartsWithOperator).toBeDefined();
    expect(EndsWithOperator).toBeDefined();
    expect(RegexOperator).toBeDefined();
    expect(StringLengthOperator).toBeDefined();
  });
}); 