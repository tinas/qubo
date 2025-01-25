import { StringLengthOperator } from '../length.operator';

describe('StringLengthOperator', () => {
  let operator: StringLengthOperator;

  beforeEach(() => {
    operator = new StringLengthOperator();
  });

  it('should return true when string length matches target value', () => {
    expect(operator.evaluate('hello', 5)).toBe(true);
    expect(operator.evaluate('', 0)).toBe(true);
    expect(operator.evaluate('hello world', 11)).toBe(true);
  });

  it('should return false when string length does not match target value', () => {
    expect(operator.evaluate('hello', 4)).toBe(false);
    expect(operator.evaluate('hello', 6)).toBe(false);
    expect(operator.evaluate('', 1)).toBe(false);
  });

  it('should handle special characters', () => {
    expect(operator.evaluate('hello\nworld', 11)).toBe(true);
    expect(operator.evaluate('hello\tworld', 11)).toBe(true);
    expect(operator.evaluate('hello\u0000world', 11)).toBe(true);
    expect(operator.evaluate('hello👋world', 11)).toBe(true);
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(null as any, 4)).toBe(false);
    expect(operator.evaluate(undefined as any, 4)).toBe(false);
    expect(operator.evaluate('hello', null as any)).toBe(false);
    expect(operator.evaluate('hello', undefined as any)).toBe(false);
  });

  it('should handle non-string values', () => {
    expect(operator.evaluate(123 as any, 3)).toBe(false);
    expect(operator.evaluate({} as any, 0)).toBe(false);
    expect(operator.evaluate([] as any, 0)).toBe(false);
    expect(operator.evaluate(true as any, 4)).toBe(false);
  });

  it('should handle non-number target values', () => {
    expect(operator.evaluate('hello', '5' as any)).toBe(false);
    expect(operator.evaluate('hello', {} as any)).toBe(false);
    expect(operator.evaluate('hello', [] as any)).toBe(false);
    expect(operator.evaluate('hello', true as any)).toBe(false);
  });
});