import { DateBetweenOperator } from '../date-between.operator';

describe('DateBetweenOperator', () => {
  let operator: DateBetweenOperator;

  beforeEach(() => {
    operator = new DateBetweenOperator();
  });

  describe('evaluate', () => {
    it('should return true when date is between start and end dates', () => {
      const value = new Date('2024-01-25T12:00:00Z');
      const start = new Date('2024-01-24T12:00:00Z');
      const end = new Date('2024-01-26T12:00:00Z');
      expect(operator.evaluate(value, [start, end])).toBe(true);
    });

    it('should return false when date is before start date', () => {
      const value = new Date('2024-01-23T12:00:00Z');
      const start = new Date('2024-01-24T12:00:00Z');
      const end = new Date('2024-01-26T12:00:00Z');
      expect(operator.evaluate(value, [start, end])).toBe(false);
    });

    it('should return false when date is after end date', () => {
      const value = new Date('2024-01-27T12:00:00Z');
      const start = new Date('2024-01-24T12:00:00Z');
      const end = new Date('2024-01-26T12:00:00Z');
      expect(operator.evaluate(value, [start, end])).toBe(false);
    });

    it('should handle string dates', () => {
      const value = new Date('2024-01-25T12:00:00Z');
      expect(operator.evaluate(value, ['2024-01-24', '2024-01-26'])).toBe(true);
    });

    it('should handle invalid dates', () => {
      const value = new Date('2024-01-25T12:00:00Z');
      expect(operator.evaluate(value, ['invalid', '2024-01-26'])).toBe(false);
      expect(operator.evaluate(value, ['2024-01-24', 'invalid'])).toBe(false);
      expect(operator.evaluate(new Date('invalid'), ['2024-01-24', '2024-01-26'])).toBe(false);
    });

    it('should handle invalid condition format', () => {
      const value = new Date('2024-01-25T12:00:00Z');
      expect(operator.evaluate(value, ['2024-01-24'] as any)).toBe(false);
      expect(operator.evaluate(value, null as any)).toBe(false);
      expect(operator.evaluate(value, undefined as any)).toBe(false);
    });

    it('should handle invalid value', () => {
      expect(operator.evaluate(null as any, ['2024-01-24', '2024-01-26'])).toBe(false);
      expect(operator.evaluate(undefined as any, ['2024-01-24', '2024-01-26'])).toBe(false);
      expect(operator.evaluate({} as any, ['2024-01-24', '2024-01-26'])).toBe(false);
    });
  });
}); 