import { DateBeforeOperator } from '../date-before.operator';

describe('DateBeforeOperator', () => {
  let operator: DateBeforeOperator;

  beforeEach(() => {
    operator = new DateBeforeOperator();
  });

  describe('evaluate', () => {
    it('should return true when date is before target date', () => {
      const date = new Date('2024-01-24T12:00:00Z');
      const target = new Date('2024-01-25T12:00:00Z');
      expect(operator.evaluate(date, target)).toBe(true);
    });

    it('should return false when date is after target date', () => {
      const date = new Date('2024-01-25T12:00:00Z');
      const target = new Date('2024-01-24T12:00:00Z');
      expect(operator.evaluate(date, target)).toBe(false);
    });

    it('should return false when date is equal to target date', () => {
      const date = new Date('2024-01-25T12:00:00Z');
      const target = new Date('2024-01-25T12:00:00Z');
      expect(operator.evaluate(date, target)).toBe(false);
    });

    it('should handle string dates', () => {
      const date = new Date('2024-01-24T12:00:00Z');
      const target = '2024-01-25T12:00:00Z';
      expect(operator.evaluate(date, target)).toBe(true);
    });

    it('should handle invalid dates', () => {
      const date = new Date('2024-01-25T12:00:00Z');
      expect(operator.evaluate(date, 'invalid-date')).toBe(false);
      expect(operator.evaluate(new Date('invalid'), date)).toBe(false);
      expect(operator.evaluate(null as any, date)).toBe(false);
    });
  });
}); 