import { RegexOperator } from '../regex.operator';

describe('RegexOperator', () => {
  let operator: RegexOperator;

  beforeEach(() => {
    operator = new RegexOperator();
  });

  it('should return true when string matches pattern', () => {
    expect(operator.evaluate('hello world', '^hello')).toBe(true);
    expect(operator.evaluate('hello world', 'world$')).toBe(true);
    expect(operator.evaluate('hello world', 'hello.*world')).toBe(true);
    expect(operator.evaluate('12345', '\\d+')).toBe(true);
  });

  it('should return false when string does not match pattern', () => {
    expect(operator.evaluate('hello world', '^world')).toBe(false);
    expect(operator.evaluate('hello world', 'hello$')).toBe(false);
    expect(operator.evaluate('hello world', 'xyz')).toBe(false);
    expect(operator.evaluate('abcde', '\\d+')).toBe(false);
  });

  it('should handle regex special characters', () => {
    expect(operator.evaluate('hello.world', '\\.')).toBe(true);
    expect(operator.evaluate('hello*world', '\\*')).toBe(true);
    expect(operator.evaluate('hello+world', '\\+')).toBe(true);
    expect(operator.evaluate('hello?world', '\\?')).toBe(true);
  });

  it('should handle regex character classes', () => {
    expect(operator.evaluate('abc123', '[a-z]+')).toBe(true);
    expect(operator.evaluate('ABC123', '[A-Z]+')).toBe(true);
    expect(operator.evaluate('123', '[0-9]+')).toBe(true);
    expect(operator.evaluate('hello_world', '\\w+')).toBe(true);
  });

  it('should handle regex quantifiers', () => {
    expect(operator.evaluate('a', 'a?')).toBe(true);
    expect(operator.evaluate('', 'a?')).toBe(true);
    expect(operator.evaluate('aaa', 'a+')).toBe(true);
    expect(operator.evaluate('', 'a*')).toBe(true);
    expect(operator.evaluate('aaa', 'a{3}')).toBe(true);
  });

  it('should handle invalid regex patterns', () => {
    expect(operator.evaluate('hello', '[')).toBe(false);
    expect(operator.evaluate('hello', '(')).toBe(false);
    expect(operator.evaluate('hello', '*')).toBe(false);
    expect(operator.evaluate('hello', '+')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(null as any, '.*')).toBe(false);
    expect(operator.evaluate(undefined as any, '.*')).toBe(false);
    expect(operator.evaluate('hello', null as any)).toBe(false);
    expect(operator.evaluate('hello', undefined as any)).toBe(false);
    expect(operator.evaluate('', '')).toBe(true);
  });

  it('should handle non-string values', () => {
    expect(operator.evaluate(123 as any, '\\d+')).toBe(false);
    expect(operator.evaluate({} as any, '.*')).toBe(false);
    expect(operator.evaluate([] as any, '.*')).toBe(false);
    expect(operator.evaluate(true as any, '.*')).toBe(false);
  });
});