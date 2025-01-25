import { StartsWithOperator } from '../starts-with.operator';

describe('StartsWithOperator', () => {
  let operator: StartsWithOperator;

  beforeEach(() => {
    operator = new StartsWithOperator();
  });

  it('should return true when string starts with target value', () => {
    expect(operator.evaluate('hello world', 'hello')).toBe(true);
    expect(operator.evaluate('hello', 'h')).toBe(true);
    expect(operator.evaluate('hello world', '')).toBe(true);
  });

  it('should return false when string does not start with target value', () => {
    expect(operator.evaluate('hello world', 'world')).toBe(false);
    expect(operator.evaluate('hello', 'ello')).toBe(false);
    expect(operator.evaluate('', 'hello')).toBe(false);
  });

  it('should handle case sensitivity', () => {
    expect(operator.evaluate('Hello World', 'hello')).toBe(false);
    expect(operator.evaluate('Hello World', 'Hello')).toBe(true);
    expect(operator.evaluate('HELLO', 'hello')).toBe(false);
  });

  it('should handle special characters', () => {
    expect(operator.evaluate('@hello', '@')).toBe(true);
    expect(operator.evaluate('$price', '$')).toBe(true);
    expect(operator.evaluate('\nline', '\n')).toBe(true);
    expect(operator.evaluate('\tindented', '\t')).toBe(true);
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