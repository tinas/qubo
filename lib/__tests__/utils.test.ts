import { isValidOperatorName, resolvePath, evaluateValue, evaluateDocument } from '../utils';
import { type OperatorFunction } from '../types';

describe('Utility Functions', () => {
  describe('isValidOperatorName', () => {
    it('should return true for valid operator names', () => {
      expect(isValidOperatorName('$test')).toBe(true);
      expect(isValidOperatorName('$')).toBe(true);
    });

    it('should return false for invalid operator names', () => {
      expect(isValidOperatorName('test')).toBe(false);
      expect(isValidOperatorName('')).toBe(false);
    });
  });

  describe('resolvePath', () => {
    const testObj = {
      a: 1,
      b: {
        c: 2,
        d: [1, 2, 3],
      },
      'e.f': {
        g: 3,
      },
      arr: [
        { value: 1 },
        { value: 2 },
      ],
    };

    it('should resolve simple paths', () => {
      expect(resolvePath(testObj, 'a')).toBe(1);
    });

    it('should resolve nested paths', () => {
      expect(resolvePath(testObj, 'b.c')).toBe(2);
    });

    it('should resolve array indices', () => {
      expect(resolvePath(testObj, 'b.d[1]')).toBe(2);
    });

    it('should resolve paths with dots in keys', () => {
      expect(resolvePath(testObj, 'e\\.f.g')).toBe(3);
    });

    it('should handle undefined paths', () => {
      expect(resolvePath(testObj, 'x.y.z')).toBeUndefined();
    });

    it('should handle invalid array indices', () => {
      expect(resolvePath(testObj, 'b.d[10]')).toBeUndefined();
    });

    it('should handle array access on non-arrays', () => {
      expect(resolvePath(testObj, 'a[0]')).toBeUndefined();
    });

    it('should handle empty path', () => {
      expect(resolvePath(testObj, '')).toBeUndefined();
    });
  });

  describe('evaluateValue', () => {
    const operators = new Map<string, OperatorFunction>();
    operators.set('$gt', (value: unknown, operand: unknown) => {
      return typeof value === 'number' && typeof operand === 'number' && value > operand;
    });

    it('should evaluate simple equality', () => {
      expect(evaluateValue(1, 1, operators)).toBe(true);
      expect(evaluateValue(1, 2, operators)).toBe(false);
    });

    it('should evaluate operators', () => {
      expect(evaluateValue(5, { $gt: 3 }, operators)).toBe(true);
      expect(evaluateValue(2, { $gt: 3 }, operators)).toBe(false);
    });

    it('should handle nested operators', () => {
      expect(evaluateValue({ a: 5 }, { a: { $gt: 3 } }, operators)).toBe(true);
    });

    it('should handle undefined values', () => {
      expect(evaluateValue(undefined, undefined, operators)).toBe(true);
      expect(evaluateValue(1, undefined, operators)).toBe(false);
    });

    it('should handle null values', () => {
      expect(evaluateValue(null, null, operators)).toBe(true);
      expect(evaluateValue(1, null, operators)).toBe(false);
    });
  });

  describe('evaluateDocument', () => {
    const operators = new Map<string, OperatorFunction>();
    operators.set('$gt', (value: unknown, operand: unknown) => {
      return typeof value === 'number' && typeof operand === 'number' && value > operand;
    });

    it('should evaluate simple document matches', () => {
      const doc = { a: 1, b: 2 };
      expect(evaluateDocument(doc, { a: 1 }, operators)).toBe(true);
      expect(evaluateDocument(doc, { a: 2 }, operators)).toBe(false);
    });

    it('should evaluate nested documents', () => {
      const doc = { a: { b: { c: 5 } } };
      expect(evaluateDocument(doc, { 'a.b.c': 5 }, operators)).toBe(true);
    });

    it('should evaluate array fields', () => {
      const doc = { arr: [1, 2, 3] };
      expect(evaluateDocument(doc, { 'arr[1]': 2 }, operators)).toBe(true);
    });

    it('should evaluate with operators', () => {
      const doc = { value: 5 };
      expect(evaluateDocument(doc, { value: { $gt: 3 } }, operators)).toBe(true);
    });

    it('should handle non-object documents', () => {
      expect(evaluateDocument('not an object', { a: 1 }, operators)).toBe(false);
    });
  });
}); 