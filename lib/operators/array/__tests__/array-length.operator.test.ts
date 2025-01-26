import { ArrayLengthOperator } from '../array-length.operator';

describe('ArrayLengthOperator', () => {
  let operator: ArrayLengthOperator<unknown>;

  beforeEach(() => {
    operator = new ArrayLengthOperator();
  });

  describe('evaluate', () => {
    it('should return true when array length matches target', () => {
      expect(operator.evaluate([1, 2, 3], 3)).toBe(true);
      expect(operator.evaluate(['a', 'b'], 2)).toBe(true);
      expect(operator.evaluate([], 0)).toBe(true);
    });

    it('should return false when array length does not match target', () => {
      expect(operator.evaluate([1, 2, 3], 2)).toBe(false);
      expect(operator.evaluate(['a', 'b'], 3)).toBe(false);
      expect(operator.evaluate([], 1)).toBe(false);
    });

    it('should handle non-array values', () => {
      expect(operator.evaluate('not an array' as unknown as unknown[], 3)).toBe(false);
      expect(operator.evaluate(null as unknown as unknown[], 3)).toBe(false);
      expect(operator.evaluate(undefined as unknown as unknown[], 3)).toBe(false);
      expect(operator.evaluate({} as unknown as unknown[], 3)).toBe(false);
    });

    it('should handle invalid target values', () => {
      expect(operator.evaluate([1, 2, 3], -1)).toBe(false);
      expect(operator.evaluate([1, 2, 3], NaN)).toBe(false);
      expect(operator.evaluate([1, 2, 3], Infinity)).toBe(false);
    });
  });
}); 