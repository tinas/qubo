import { ContainsOperator } from '../contains.operator';

describe('ContainsOperator', () => {
  let operator: ContainsOperator;

  beforeEach(() => {
    operator = new ContainsOperator();
  });

  it('should return true when string contains target value', () => {
    expect(operator.evaluate('hello world', 'world')).toBe(true);
    expect(operator.evaluate('hello world', 'hello')).toBe(true);
    expect(operator.evaluate('hello world', ' ')).toBe(true);
    expect(operator.evaluate('hello world', '')).toBe(false);
  });

  it('should return false when string does not contain target value', () => {
    expect(operator.evaluate('hello world', 'xyz')).toBe(false);
    expect(operator.evaluate('hello', 'world')).toBe(false);
    expect(operator.evaluate('', 'world')).toBe(false);
  });

  it('should handle short target strings (length <= 3) correctly', () => {
    expect(operator.evaluate('hello world', 'o')).toBe(true);
    expect(operator.evaluate('hello world', 'lo')).toBe(true);
    expect(operator.evaluate('hello world', 'wor')).toBe(true);
    expect(operator.evaluate('hello world', 'xyz')).toBe(false);
  });

  it('should handle case sensitivity', () => {
    expect(operator.evaluate('Hello World', 'hello')).toBe(false);
    expect(operator.evaluate('Hello World', 'WORLD')).toBe(false);
    expect(operator.evaluate('Hello World', 'World')).toBe(true);
  });

  it('should handle special characters', () => {
    expect(operator.evaluate('hello@world.com', '@')).toBe(true);
    expect(operator.evaluate('price: $100', '$')).toBe(true);
    expect(operator.evaluate('line1\nline2', '\n')).toBe(true);
    expect(operator.evaluate('tab\there', '\t')).toBe(true);
  });

  it('should handle edge cases', () => {
    expect(operator.evaluate(null as any, 'world')).toBe(false);
    expect(operator.evaluate(undefined as any, 'world')).toBe(false);
    expect(operator.evaluate('hello world', null as any)).toBe(false);
    expect(operator.evaluate('hello world', undefined as any)).toBe(false);
    expect(operator.evaluate('', '')).toBe(false);
  });

  it('should handle non-string values', () => {
    expect(operator.evaluate(123 as any, 'world')).toBe(false);
    expect(operator.evaluate({} as any, 'world')).toBe(false);
    expect(operator.evaluate([] as any, 'world')).toBe(false);
    expect(operator.evaluate(true as any, 'world')).toBe(false);
  });

  describe('caching', () => {
    it('should cache results', () => {
      const value = 'hello world';
      const target = 'world';

      // First call - should compute and cache
      expect(operator.evaluate(value, target)).toBe(true);

      // Spy on internal evaluation
      const spy = jest.spyOn(operator as any, 'evaluateInternal');

      // Second call - should use cache
      expect(operator.evaluate(value, target)).toBe(true);
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should generate different cache keys for different inputs', () => {
      const spy = jest.spyOn(operator as any, 'getCacheKey');

      operator.evaluate('hello world', 'world');
      operator.evaluate('hello earth', 'earth');

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.results[0].value).not.toBe(spy.mock.results[1].value);

      spy.mockRestore();
    });
  });
});