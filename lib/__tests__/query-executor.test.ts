import { QueryExecutor } from '../query-executor';
import { BaseOperator } from '../operators/base.operator';
import { ArrayContainsOperator } from '../operators/array/contains.operator';
import { Query } from '../query.types';

describe('QueryExecutor', () => {
  // Sample data for testing
  const sampleData = [
    { id: 1, name: 'John', age: 30, roles: ['user'], active: true, nested: { value: 10 } },
    { id: 2, name: 'Jane', age: 25, roles: ['admin', 'user'], active: false, nested: { value: 20 } },
    { id: 3, name: 'Bob', age: 35, roles: ['user'], active: true, nested: { value: 30 } },
  ];

  let executor: QueryExecutor<typeof sampleData[0]>;

  beforeEach(() => {
    executor = new QueryExecutor(sampleData);
  });

  describe('basic queries', () => {
    it('should find items by exact value', () => {
      const result = executor.find({ name: 'John' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should find items by comparison operators', () => {
      const result = executor.find({ age: { $gt: 25 } });
      expect(result).toHaveLength(2);
      const ids = [];
      for (const item of result) {
        ids.push(item.id);
      }
      expect(ids).toEqual([1, 3]);
    });

    it('should handle multiple conditions', () => {
      const result = executor.find({
        age: { $gt: 25 },
        active: true,
      });
      expect(result).toHaveLength(2);
      const ids = [];
      for (const item of result) {
        ids.push(item.id);
      }
      expect(ids).toEqual([1, 3]);
    });

    it('should handle nested fields', () => {
      const result = executor.find({ 'nested.value': { $gt: 15 } });
      expect(result).toHaveLength(2);
      const ids = [];
      for (const item of result) {
        ids.push(item.id);
      }
      expect(ids).toEqual([2, 3]);
    });
  });

  describe('logical operators', () => {
    it('should handle $and operator', () => {
      const result = executor.find({
        $and: [
          { age: { $gt: 25 } },
          { active: true },
        ],
      });
      expect(result).toHaveLength(2);
      const ids = [];
      for (const item of result) {
        ids.push(item.id);
      }
      expect(ids).toEqual([1, 3]);
    });

    it('should handle $or operator', () => {
      const result = executor.find({
        $or: [
          { name: 'John' },
          { name: 'Jane' },
        ],
      });
      expect(result).toHaveLength(2);
      const ids = [];
      for (const item of result) {
        ids.push(item.id);
      }
      expect(ids).toEqual([1, 2]);
    });

    it('should handle $not operator', () => {
      const result = executor.find({
        $not: [{ active: true }],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should handle invalid logical operators', () => {
      const result = executor.find({
        $invalid: [{ active: true }],
      } as unknown as Query<typeof sampleData[0]>);
      expect(result).toHaveLength(0);
    });

    it('should handle nested logical operators', () => {
      const result = executor.find({
        $and: [
          {
            $or: [
              { name: 'John' },
              { name: 'Jane' },
            ],
          },
          { active: true },
        ],
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test('should handle unknown logical operators', () => {
      const executor = new QueryExecutor([{ name: 'John' }]);
      // @ts-expect-error - Testing invalid logical operator
      const result = executor.evaluateLogicalOperatorForTesting('$unknown', [{ name: 'John' }], { name: 'John' });
      expect(result).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should return the first matching item', () => {
      const result = executor.findOne({ age: { $gt: 25 } });
      expect(result).not.toBeUndefined();
      expect(result?.id).toBe(1);
    });

    it('should return undefined when no match is found', () => {
      const result = executor.findOne({ name: 'NonExistent' });
      expect(result).toBeNull();
    });
  });

  describe('custom operators', () => {
    class ContainsOperator extends BaseOperator<string, string> {
      evaluate(value: string, target: string): boolean {
        return value.includes(target);
      }
    }

    it('should allow adding custom operators', () => {
      executor.addOperator('$contains', new ContainsOperator());
      const result = executor.find({ name: { $contains: 'oh' } });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should throw error when adding operator without $ prefix', () => {
      expect(() => {
        executor.addOperator('contains', new ContainsOperator());
      }).toThrow('Custom operator names must start with $');
    });

    it('should allow removing custom operators', () => {
      executor.addOperator('$custom', new ContainsOperator());
      executor.removeOperator('$custom');
      const result = executor.find({ name: { $custom: 'oh' } });
      expect(result).toHaveLength(0);
    });

    it('should not allow removing built-in operators', () => {
      expect(() => {
        executor.removeOperator('$eq');
      }).toThrow('Cannot remove built-in operators');
    });
  });

  describe('edge cases', () => {
    it('should handle non-existent fields', () => {
      const result = executor.find({ nonexistent: 'value' });
      expect(result).toHaveLength(0);
    });

    it('should handle non-existent operators', () => {
      const result = executor.find({ name: { $nonexistent: 'value' } });
      expect(result).toHaveLength(0);
    });

    it('should handle undefined values', () => {
      const dataWithUndefined = [
        ...sampleData,
        { id: 4, name: undefined, age: 40, roles: [], active: true, nested: { value: 40 } },
      ];
      const executorWithUndefined = new QueryExecutor(dataWithUndefined);
      const result = executorWithUndefined.find({ name: undefined });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });

    it('should handle deeply nested paths that dont exist', () => {
      const result = executor.find({ 'nested.nonexistent.value': 10 });
      expect(result).toHaveLength(0);
    });

    it('should handle unknown operators in field conditions', () => {
      const executor = new QueryExecutor([
        { name: 'John', age: 30 },
      ]);

      const result = executor.find({
        age: { '$unknownOperator': 30 },
      });

      expect(result).toHaveLength(0);
    });

    it('should handle undefined operators in field conditions', () => {
      const executor = new QueryExecutor([
        { name: 'John', age: 30 },
      ]);

      // Simulate a case where the operator is undefined
      const operators = new Map();
      ((executor as unknown) as { operators: Map<string, unknown> }).operators = operators;

      const result = executor.find({
        age: { '$someOperator': 30 },
      });

      expect(result).toHaveLength(0);
    });

    it('should handle missing operators in field conditions', () => {
      const executor = new QueryExecutor([{ name: 'John', age: 30 }]);
      const operators = new Map();
      ((executor as unknown) as { operators: Map<string, unknown> }).operators = operators;
      const result = executor.find({ age: { '$someOperator': 30 } });
      expect(result).toHaveLength(0);
    });

    it('should handle missing equals operator', () => {
      const executor = new QueryExecutor([{ name: 'John', age: 30 }]);
      const operators = new Map();
      ((executor as unknown) as { operators: Map<string, unknown> }).operators = operators;
      const result = executor.find({ name: 'John' });
      expect(result).toHaveLength(0);
    });

    it('should evaluate single item against null and undefined values', () => {
      const itemWithUndefined1 = { ...sampleData[0], optional: undefined };
      const itemWithUndefined2 = { ...sampleData[0], optional: undefined };

      expect(executor.evaluate(itemWithUndefined1, { optional: undefined })).toBe(true);
      expect(executor.evaluate(itemWithUndefined2, { optional: undefined })).toBe(true);
    });
  });

  describe('evaluate', () => {
    it('should evaluate single item against exact value', () => {
      const item = sampleData[0];
      expect(executor.evaluate(item, { name: 'John' })).toBe(true);
      expect(executor.evaluate(item, { name: 'Jane' })).toBe(false);
    });

    it('should evaluate single item against comparison operators', () => {
      const item = sampleData[0];
      expect(executor.evaluate(item, { age: { $gt: 25 } })).toBe(true);
      expect(executor.evaluate(item, { age: { $lt: 25 } })).toBe(false);
    });

    it('should evaluate single item against multiple conditions', () => {
      const item = sampleData[0];
      expect(executor.evaluate(item, {
        age: { $gt: 25 },
        active: true,
      })).toBe(true);
    });

    it('should evaluate single item against nested fields', () => {
      const item = sampleData[0];
      expect(executor.evaluate(item, { 'nested.value': 10 })).toBe(true);
      expect(executor.evaluate(item, { 'nested.value': { $gt: 5 } })).toBe(true);
      expect(executor.evaluate(item, { 'nested.value': { $gt: 15 } })).toBe(false);
    });

    it('should evaluate single item against array fields', () => {
      executor.addOperator('$contains', new ArrayContainsOperator());
      const item = sampleData[0];
      expect(executor.evaluate(item, { roles: { $contains: 'user' } })).toBe(true);
      expect(executor.evaluate(item, { roles: { $contains: 'admin' } })).toBe(false);
    });

    it('should evaluate single item against complex logical conditions', () => {
      const item = sampleData[0];
      expect(executor.evaluate(item, {
        $and: [
          { age: { $gt: 25 } },
          {
            $or: [
              { name: 'John' },
              { name: 'Jane' },
            ],
          },
        ],
      })).toBe(true);

      expect(executor.evaluate(item, {
        $and: [
          { age: { $gt: 35 } },
          {
            $or: [
              { name: 'John' },
              { name: 'Jane' },
            ],
          },
        ],
      })).toBe(false);
    });

    it('should evaluate single item against non-existent fields', () => {
      const item = sampleData[0];
      expect(executor.evaluate(item, { nonexistent: 'value' })).toBe(false);
      expect(executor.evaluate(item, { 'nested.nonexistent': 'value' })).toBe(false);
    });

    it('should evaluate single item with custom operators', () => {
      class ContainsOperator extends BaseOperator<string, string> {
        evaluate(value: string, target: string): boolean {
          return value.includes(target);
        }
      }

      executor.addOperator('$contains', new ContainsOperator());
      const item = sampleData[0];
      expect(executor.evaluate(item, { name: { $contains: 'oh' } })).toBe(true);
      expect(executor.evaluate(item, { name: { $contains: 'xyz' } })).toBe(false);
    });

    it('should evaluate single item against date values', () => {
      const itemWithDate = {
        ...sampleData[0],
        createdAt: new Date('2024-01-01'),
      };

      expect(executor.evaluate(itemWithDate, {
        createdAt: { $gt: new Date('2023-12-31') },
      })).toBe(true);

      expect(executor.evaluate(itemWithDate, {
        createdAt: { $lt: new Date('2023-12-31') },
      })).toBe(false);
    });
  });
});
