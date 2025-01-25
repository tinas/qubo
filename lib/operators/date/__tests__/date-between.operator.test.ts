import { DateBetweenOperator } from '../date-between.operator';

describe('DateBetweenOperator', () => {
  let operator: DateBetweenOperator;

  beforeEach(() => {
    operator = new DateBetweenOperator();
  });

  it('should return true when date is between start and end dates', () => {
    const date = new Date('2024-01-25');
    const range: [Date, Date] = [new Date('2024-01-24'), new Date('2024-01-26')];
    expect(operator.evaluate(date, range)).toBe(true);
  });

  it('should return true when date equals start or end date', () => {
    const startDate = new Date('2024-01-24');
    const endDate = new Date('2024-01-26');
    const range: [Date, Date] = [startDate, endDate];

    expect(operator.evaluate(startDate, range)).toBe(true);
    expect(operator.evaluate(endDate, range)).toBe(true);
  });

  it('should return false when date is outside the range', () => {
    const date = new Date('2024-01-23');
    const range: [Date, Date] = [new Date('2024-01-24'), new Date('2024-01-26')];
    expect(operator.evaluate(date, range)).toBe(false);

    const date2 = new Date('2024-01-27');
    expect(operator.evaluate(date2, range)).toBe(false);
  });

  it('should handle string dates', () => {
    const date = new Date('2024-01-25');
    const range: [string, string] = ['2024-01-24', '2024-01-26'];
    expect(operator.evaluate(date, range)).toBe(true);

    const range2: [string, string] = ['2024-01-26', '2024-01-27'];
    expect(operator.evaluate(date, range2)).toBe(false);
  });

  it('should handle time components', () => {
    const date = new Date('2024-01-25T12:00:00Z');
    const range: [string, string] = [
      '2024-01-25T11:59:59Z',
      '2024-01-25T12:00:01Z'
    ];
    expect(operator.evaluate(date, range)).toBe(true);

    const range2: [string, string] = [
      '2024-01-25T12:00:01Z',
      '2024-01-25T12:00:02Z'
    ];
    expect(operator.evaluate(date, range2)).toBe(false);
  });

  it('should handle edge cases', () => {
    const date = new Date('2024-01-25');
    const range: [string, string] = ['2024-01-24', '2024-01-26'];

    expect(operator.evaluate(null as any, range)).toBe(false);
    expect(operator.evaluate(undefined as any, range)).toBe(false);
    expect(operator.evaluate(date, null as any)).toBe(false);
    expect(operator.evaluate(date, undefined as any)).toBe(false);
  });

  it('should handle invalid dates', () => {
    const date = new Date('2024-01-25');
    expect(operator.evaluate(date, ['invalid-date', '2024-01-26'])).toBe(false);
    expect(operator.evaluate(date, ['2024-01-24', 'invalid-date'])).toBe(false);
    expect(operator.evaluate(date, ['', ''])).toBe(false);
    expect(operator.evaluate(new Date('invalid'), ['2024-01-24', '2024-01-26'])).toBe(false);
  });
}); 