import { createQubo } from '../index';
import { OperatorFunction } from '../types';

describe('qubo', () => {
  const data = [
    { id: 1, name: 'John', age: 30, tags: ['developer', 'js'] },
    { id: 2, name: 'Jane', age: 25, tags: ['designer', 'css'] },
    { id: 3, name: 'Bob', age: 35, tags: ['developer', 'python'] },
  ];

  const store = createQubo(data);

  describe('find', () => {
    it('should find documents by exact match', () => {
      const result = store.find({ name: 'John' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
    });

    it('should find documents by $eq operator', () => {
      const result = store.find({ age: { $eq: 30 } });
      expect(result).toHaveLength(1);
      expect(result[0].age).toBe(30);
    });

    it('should find documents by $gt operator', () => {
      const result = store.find({ age: { $gt: 30 } });
      expect(result).toHaveLength(1);
      expect(result[0].age).toBe(35);
    });

    it('should find documents by $gte operator', () => {
      const result = store.find({ age: { $gte: 30 } });
      expect(result).toHaveLength(2);
      expect(result.map((document) => document.age).sort()).toEqual([30, 35]);
    });

    it('should find documents by $lt operator', () => {
      const result = store.find({ age: { $lt: 30 } });
      expect(result).toHaveLength(1);
      expect(result[0].age).toBe(25);
    });

    it('should find documents by $lte operator', () => {
      const result = store.find({ age: { $lte: 30 } });
      expect(result).toHaveLength(2);
      expect(result.map((document) => document.age).sort()).toEqual([25, 30]);
    });

    it('should find documents by $in operator', () => {
      const result = store.find({ age: { $in: [25, 35] } });
      expect(result).toHaveLength(2);
      expect(result.map((document) => document.age).sort()).toEqual([25, 35]);
    });

    it('should find documents by $nin operator', () => {
      const result = store.find({ age: { $nin: [25, 35] } });
      expect(result).toHaveLength(1);
      expect(result[0].age).toBe(30);
    });

    it('should find documents by $all operator', () => {
      const result = store.find({ tags: { $all: ['developer'] } });
      expect(result).toHaveLength(2);
      expect(result.map((document) => document.name).sort()).toEqual(['Bob', 'John']);
    });

    it('should handle $all operator with non-array values', () => {
      const result = store.find({ name: { $all: ['John'] } });
      expect(result).toHaveLength(0);
    });

    it('should find documents by $exists operator', () => {
      const result = store.find({ tags: { $exists: true } });
      expect(result).toHaveLength(3);
    });

    it('should find documents by $type operator', () => {
      const result = store.find({ tags: { $type: 'array' } });
      expect(result).toHaveLength(3);
    });

    it('should handle $type operator with null values', () => {
      const storeWithNull = createQubo([
        { id: 1, name: 'John', value: undefined },
        { id: 2, name: 'Jane', value: 42 },
      ]);
      const result = storeWithNull.find({ value: { $type: 'null' } });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
    });

    it('should find documents by $and operator', () => {
      const result = store.find({
        $and: [
          { age: { $gt: 25 } },
          { tags: { $all: ['developer'] } },
        ],
      });
      expect(result).toHaveLength(2);
      expect(result.map((document) => document.name).sort()).toEqual(['Bob', 'John']);
    });

    it('should find documents by $or operator', () => {
      const result = store.find({
        $or: [
          { age: { $lt: 26 } },
          { tags: { $all: ['python'] } },
        ],
      });
      expect(result).toHaveLength(2);
      expect(result.map((document) => document.name).sort()).toEqual(['Bob', 'Jane']);
    });

    it('should find documents by $not operator', () => {
      const result = store.find({
        age: { $not: { $lt: 30 } },
      });
      expect(result).toHaveLength(2);
      expect(result.map((document) => document.age).sort()).toEqual([30, 35]);
    });

    it('should find documents by $nor operator', () => {
      const result = store.find({
        $nor: [
          { age: { $lt: 30 } },
          { tags: { $all: ['python'] } },
        ],
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
    });

    it('should handle nested paths', () => {
      const storeWithNested = createQubo([
        { id: 1, name: 'John', meta: { active: true } },
        { id: 2, name: 'Jane', meta: { active: false } },
      ]);
      const result = storeWithNested.find({ 'meta.active': true });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
    });

    it('should handle $elemMatch operator', () => {
      const storeWithArrays = createQubo([
        { id: 1, scores: [{ value: 85 }, { value: 90 }] },
        { id: 2, scores: [{ value: 75 }, { value: 80 }] },
      ]);
      const result = storeWithArrays.find({
        scores: { $elemMatch: { value: { $gte: 90 } } },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should handle $elemMatch with non-array values', () => {
      const result = store.find({
        name: { $elemMatch: { $eq: 'John' } },
      });
      expect(result).toHaveLength(0);
    });

    it('should throw error for unknown operators', () => {
      expect(() => store.find({ age: { $unknown: 30 } })).toThrow('Unknown operator: $unknown');
    });
  });

  describe('findOne', () => {
    it('should find first matching document', () => {
      const result = store.findOne({ tags: { $all: ['developer'] } });
      expect(result).toBeDefined();
      expect(result?.name).toBe('John');
    });

    it('should return undefined if no document matches', () => {
      const result = store.findOne({ age: { $gt: 40 } });
      expect(result).toBeUndefined();
    });
  });

  describe('evaluate', () => {
    it('should evaluate document against query', () => {
      const document = { id: 1, name: 'John', age: 30, tags: ['developer', 'js'] };
      expect(store.evaluate(document, { age: { $gte: 30 } })).toBe(true);
      expect(store.evaluate(document, { age: { $lt: 30 } })).toBe(false);
    });
  });

  describe('custom operators', () => {
    it('should support custom operators', () => {
      const customStore = createQubo(data, {
        operators: {
          $between: ((value: number, [min, max]: [number, number]) =>
            value >= min && value <= max) as OperatorFunction,
          $contains: ((value: string, substr: string) =>
            typeof value === 'string' && value.includes(substr)) as OperatorFunction,
        },
      });

      const result1 = customStore.find({ age: { $between: [25, 30] } });
      expect(result1).toHaveLength(2);
      expect(result1.map((document) => document.age).sort()).toEqual([25, 30]);

      const result2 = customStore.find({ name: { $contains: 'oh' } });
      expect(result2).toHaveLength(1);
      expect(result2[0].name).toBe('John');
    });
  });
});
