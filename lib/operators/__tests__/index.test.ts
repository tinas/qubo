import { operators } from '..';
import { comparisonOperators } from '../comparison';
import { stringOperators } from '../string';
import { dateOperators } from '../date';
import { arrayOperators } from '../array';

describe('Operators index', () => {
  it('should export all operators with correct keys', () => {
    expect(operators).toBeDefined();
    expect(Object.keys(operators).length).toBeGreaterThan(0);
  });

  it('should export all operator classes', () => {
    for (const key of Object.keys(operators)) {
      expect(operators[key as keyof typeof operators]).toBeDefined();
      expect(typeof operators[key as keyof typeof operators]).toBe('function');
      expect(key.startsWith('$')).toBe(true);
    }
  });

  it('should include all operator groups', () => {
    expect(comparisonOperators).toBeDefined();
    expect(stringOperators).toBeDefined();
    expect(dateOperators).toBeDefined();
    expect(arrayOperators).toBeDefined();
  });
}); 