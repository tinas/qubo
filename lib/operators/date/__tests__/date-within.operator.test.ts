import { DateWithinOperator } from '../date-within.operator';

describe('DateWithinOperator', () => {
  let operator: DateWithinOperator;

  beforeEach(() => {
    operator = new DateWithinOperator();
  });

  describe('evaluate', () => {
    it('should return true when date is within the specified days', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
      expect(operator.evaluate(date, { days: 3 })).toBe(true);
    });

    it('should return false when date is outside the specified days', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      expect(operator.evaluate(date, { days: 3 })).toBe(false);
    });

    it('should handle edge cases', () => {
      const now = new Date();
      const date = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
      expect(operator.evaluate(date, { days: 3 })).toBe(true);
    });

    it('should handle invalid dates', () => {
      expect(operator.evaluate(new Date('invalid'), { days: 3 })).toBe(false);
      expect(operator.evaluate(null as any, { days: 3 })).toBe(false);
    });

    it('should handle invalid target values', () => {
      const date = new Date();
      expect(operator.evaluate(date, null as any)).toBe(false);
      expect(operator.evaluate(date, { days: -1 })).toBe(false);
      expect(operator.evaluate(date, { days: 0 })).toBe(false);
    });
  });
}); 