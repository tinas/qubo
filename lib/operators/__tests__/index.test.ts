import { allOperators } from '..';
import { comparisonOperators } from '../comparison';
import { stringOperators } from '../string';
import { dateOperators } from '../date';
import { arrayOperators } from '../array';

describe('Operators index', () => {
  it('should combine all operators correctly', () => {
    // Count operators from each group
    const comparisonCount = comparisonOperators.size;
    const stringCount = stringOperators.size;
    const dateCount = dateOperators.size;
    const arrayCount = arrayOperators.size;

    // Account for duplicate operators ($length and $contains exist in both string and array operators)
    const duplicateOperators = 2;
    const expectedSize = comparisonCount + stringCount + dateCount + arrayCount - duplicateOperators;

    expect(allOperators.size).toBe(expectedSize);

    // Verify each operator group is included in the order they are added
    for (const [key, operator] of comparisonOperators) {
      expect(allOperators.get(key)).toBe(operator);
    }

    for (const [key, operator] of dateOperators) {
      expect(allOperators.get(key)).toBe(operator);
    }

    // Array operators should override string operators for $length and $contains
    for (const [key, operator] of arrayOperators) {
      expect(allOperators.get(key)).toBe(operator);
    }

    // Only check string operators that don't conflict with array operators
    for (const [key, operator] of stringOperators) {
      if (key !== '$length' && key !== '$contains') {
        expect(allOperators.get(key)).toBe(operator);
      }
    }
  });

  it('should export all operator groups', () => {
    expect(comparisonOperators).toBeDefined();
    expect(stringOperators).toBeDefined();
    expect(dateOperators).toBeDefined();
    expect(arrayOperators).toBeDefined();
  });
}); 