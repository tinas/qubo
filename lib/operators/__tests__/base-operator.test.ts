import { BaseOperator } from '../base.operator';

// Test implementation of BaseOperator for testing purposes
class TestOperator extends BaseOperator<unknown, unknown> {
  evaluate(value: unknown, condition: unknown): boolean {
    return value === condition;
  }
}

describe('BaseOperator', () => {
  let operator: TestOperator;

  beforeEach(() => {
    operator = new TestOperator();
  });

  describe('evaluate', () => {
    it('should evaluate primitive values correctly', () => {
      expect(operator.evaluate(42, 42)).toBe(true);
      expect(operator.evaluate('test', 'test')).toBe(true);
      expect(operator.evaluate(true, true)).toBe(true);
      expect(operator.evaluate(null, null)).toBe(true);
      expect(operator.evaluate(undefined, undefined)).toBe(true);
    });

    it('should evaluate different types correctly', () => {
      expect(operator.evaluate(42, '42')).toBe(false);
      expect(operator.evaluate(true, 1)).toBe(false);
      expect(operator.evaluate(null, undefined)).toBe(false);
    });

    it('should evaluate objects correctly', () => {
      const obj = { test: 'value' };
      expect(operator.evaluate(obj, obj)).toBe(true);
      expect(operator.evaluate(obj, { test: 'value' })).toBe(false);
    });

    it('should evaluate dates correctly', () => {
      const date = new Date('2024-01-01');
      expect(operator.evaluate(date, date)).toBe(true);
      expect(operator.evaluate(date, new Date('2024-01-01'))).toBe(false);
    });
  });
}); 