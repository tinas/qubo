import { DateBeforeOperator } from '../date-before.operator';

describe('DateBeforeOperator', () => {
  let operator: DateBeforeOperator;

  beforeEach(() => {
    operator = new DateBeforeOperator();
  });

  it('should return true when date is before target date', () => {
    const date = new Date('2024-01-24');
    const targetDate = new Date('2024-01-25');
    expect(operator.evaluate(date, targetDate)).toBe(true);
  });

  it('should return false when date is after target date', () => {
    const date = new Date('2024-01-25');
    const targetDate = new Date('2024-01-24');
    expect(operator.evaluate(date, targetDate)).toBe(false);
  });

  it('should return false when date equals target date', () => {
    const date = new Date('2024-01-25');
    const targetDate = new Date('2024-01-25');
    expect(operator.evaluate(date, targetDate)).toBe(false);
  });

  it('should handle string dates', () => {
    const date = new Date('2024-01-25');
    expect(operator.evaluate(date, '2024-01-26')).toBe(true);
    expect(operator.evaluate(date, '2024-01-25')).toBe(false);
    expect(operator.evaluate(date, '2024-01-24')).toBe(false);
  });

  it('should handle time components', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    expect(operator.evaluate(date, '2024-01-25T12:00:01Z')).toBe(true);
    expect(operator.evaluate(date, '2024-01-25T12:00:00Z')).toBe(false);
    expect(operator.evaluate(date, '2024-01-25T11:59:59Z')).toBe(false);
  });

  it('should handle edge cases', () => {
    const date = new Date('2024-01-25');
    expect(operator.evaluate(null as any, '2024-01-26')).toBe(false);
    expect(operator.evaluate(undefined as any, '2024-01-26')).toBe(false);
    expect(operator.evaluate(date, null as any)).toBe(false);
    expect(operator.evaluate(date, undefined as any)).toBe(false);
  });

  it('should handle invalid dates', () => {
    const date = new Date('2024-01-25');
    expect(operator.evaluate(date, 'invalid-date')).toBe(false);
    expect(operator.evaluate(date, '')).toBe(false);
    expect(operator.evaluate(new Date('invalid'), '2024-01-26')).toBe(false);
  });
}); 