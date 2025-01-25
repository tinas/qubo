import { EndsWithOperator } from '../ends-with.operator';

describe('EndsWithOperator', () => {
  let operator: EndsWithOperator;

  beforeEach(() => {
    operator = new EndsWithOperator();
  });

  it('should return true when string ends with target value', () => {
    expect(operator.evaluate('hello world', 'world')).toBe(true);
    expect(operator.evaluate('hello', 'o')).toBe(true);
    expect(operator.evaluate('hello world', '')).toBe(true);
  });

  it('should return false when string does not end with target value', () => {
    expect(operator.evaluate('hello world', 'hello')).toBe(false);
    expect(operator.evaluate('hello', 'hell')).toBe(false);
    expect(operator.evaluate('', 'hello')).toBe(false);
  });

  it('should handle case sensitivity', () => {
    expect(operator.evaluate('Hello World', 'world')).toBe(false);
    expect(operator.evaluate('Hello World', 'World')).toBe(true);
    expect(operator.evaluate('HELLO', 'hello')).toBe(false);
  });

  it('should handle special characters', () => {
    expect(operator.evaluate('hello@', '@')).toBe(true);
    expect(operator.evaluate('price$', '$')).toBe(true);
    expect(operator.evaluate('line\n', '\n')).toBe(true);
    expect(operator.evaluate('indented\t', '\t')).toBe(true);
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(null as any, 'hello')).toBe(false);
    expect(operator.evaluate(undefined as any, 'hello')).toBe(false);
    expect(operator.evaluate('hello', null as any)).toBe(false);
    expect(operator.evaluate('hello', undefined as any)).toBe(false);
    expect(operator.evaluate('', '')).toBe(true);
  });

  it('should handle non-string values', () => {
    expect(operator.evaluate(123 as any, 'hello')).toBe(false);
    expect(operator.evaluate({} as any, 'hello')).toBe(false);
    expect(operator.evaluate([] as any, 'hello')).toBe(false);
    expect(operator.evaluate(true as any, 'hello')).toBe(false);
  });
});