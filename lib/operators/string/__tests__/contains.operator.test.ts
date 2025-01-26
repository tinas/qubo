import { ContainsOperator } from '../contains.operator';

describe('ContainsOperator', () => {
  let operator: ContainsOperator;

  beforeEach(() => {
    operator = new ContainsOperator();
  });

  describe('evaluate', () => {
    it('should return true when string contains target', () => {
      expect(operator.evaluate('hello world', 'world')).toBe(true);
      expect(operator.evaluate('hello world', 'hello')).toBe(true);
      expect(operator.evaluate('hello world', 'o w')).toBe(true);
      expect(operator.evaluate('hello world', '')).toBe(true);
    });

    it('should return false when string does not contain target', () => {
      expect(operator.evaluate('hello world', 'xyz')).toBe(false);
      expect(operator.evaluate('hello world', 'WORLD')).toBe(false);
      expect(operator.evaluate('', 'test')).toBe(false);
    });

    it('should handle non-string values', () => {
      expect(operator.evaluate(123 as unknown as string, 'test')).toBe(false);
      expect(operator.evaluate(null as unknown as string, 'test')).toBe(false);
      expect(operator.evaluate(undefined as unknown as string, 'test')).toBe(false);
      expect(operator.evaluate({} as unknown as string, 'test')).toBe(false);
    });

    it('should handle non-string target values', () => {
      expect(operator.evaluate('test', 123 as unknown as string)).toBe(false);
      expect(operator.evaluate('test', null as unknown as string)).toBe(false);
      expect(operator.evaluate('test', undefined as unknown as string)).toBe(false);
      expect(operator.evaluate('test', {} as unknown as string)).toBe(false);
    });
  });
});