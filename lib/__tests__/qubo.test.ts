import { createQubo } from '../qubo';
import type { Query } from '../types';

// Sample test data
const testData = [
  {
    id: 1,
    name: 'Product A',
    price: 100,
    categories: ['electronics', 'gadgets'],
    stock: {
      warehouse1: 50,
      warehouse2: 30,
    },
    specs: [
      { key: 'color', value: 'black' },
      { key: 'size', value: 'medium' },
    ],
  },
  {
    id: 2,
    name: 'Product B',
    price: 200,
    categories: ['clothing', 'accessories'],
    stock: {
      warehouse1: 20,
      warehouse2: 40,
    },
    specs: [
      { key: 'color', value: 'red' },
      { key: 'size', value: 'large' },
    ],
  },
  {
    id: 3,
    name: 'Product C',
    price: 150,
    categories: ['electronics', 'accessories'],
    stock: {
      warehouse1: 0,
      warehouse2: 25,
    },
    specs: [
      { key: 'color', value: 'silver' },
      { key: 'size', value: 'small' },
    ],
  },
];

describe('Qubo Query Tests', () => {
  let qubo: ReturnType<typeof createQubo<typeof testData[0]>>;

  beforeEach(() => {
    qubo = createQubo(testData);
  });

  describe('Basic Query Tests', () => {
    it('should find exact matches with implicit $eq', () => {
      const query: Query = { id: 1 };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should find items with explicit $eq', () => {
      const query: Query = { name: { $eq: 'Product B' } };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Product B');
    });

    it('should return empty array for non-matching queries', () => {
      const query: Query = { name: 'Non Existent Product' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });
  });

  describe('Comparison Operator Tests', () => {
    it('should find items with $gt operator', () => {
      const query: Query = { price: { $gt: 150 } };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(200);
    });

    it('should find items with $gte operator', () => {
      const query: Query = { price: { $gte: 150 } };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.price)).toEqual(expect.arrayContaining([150, 200]));
    });

    it('should find items with $lt operator', () => {
      const query: Query = { price: { $lt: 150 } };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(100);
    });

    it('should handle non-numeric values in comparison operators', () => {
      const query: Query = { name: { $gt: 100 } };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle $regex operator with string pattern', () => {
      const query: Query = { name: { $regex: 'Product [AB]' } };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 2]));
    });

    it('should handle $regex operator with RegExp object', () => {
      const query: Query = { name: { $regex: /^Product [AB]$/ } };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 2]));
    });

    it('should handle $exists operator with true', () => {
      const query: Query = { name: { $exists: true } };
      const result = qubo.find(query);
      expect(result).toHaveLength(3);
      expect(result.map(item => item.id)).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it('should handle $exists operator with false', () => {
      const dataWithUndefined = [...testData, { id: 4, price: 50 }];
      const undefinedQubo = createQubo(dataWithUndefined);

      const query: Query = { name: { $exists: false } };
      const result = undefinedQubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });

    it('should throw error for invalid $exists argument', () => {
      const query: Query = { name: { $exists: 'true' as any } };
      expect(() => qubo.find(query)).toThrow('[qubo] $exists requires a boolean as its argument');
    });
  });

  describe('Array Query Tests', () => {
    it('should find items with $in operator for arrays', () => {
      const query: Query = { categories: { $in: ['electronics'] } };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 3]));
    });

    it('should find items with multiple values in $in', () => {
      const query: Query = { categories: { $in: ['electronics', 'accessories'] } };
      const result = qubo.find(query);
      expect(result).toHaveLength(3);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it('should find items with $nin operator', () => {
      const query: Query = { categories: { $nin: ['clothing'] } };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 3]));
    });

    it('should find items with $elemMatch', () => {
      const query: Query = {
        specs: {
          $elemMatch: {
            key: 'color',
            value: 'black',
          },
        },
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe('Nested Object Tests', () => {
    it('should query nested objects with dot notation', () => {
      const query: Query = { 'stock.warehouse1': 0 };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('should query nested objects with comparison operators', () => {
      const query: Query = { 'stock.warehouse2': { $gt: 30 } };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('Logical Operator Tests', () => {
    it('should find items with $and operator', () => {
      const query: Query = {
        $and: [
          { price: { $gt: 100 } },
          { categories: { $in: ['electronics'] } },
        ],
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('should find items with $or operator', () => {
      const query: Query = {
        $or: [
          { price: 200 },
          { 'stock.warehouse1': 0 },
        ],
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([2, 3]));
    });

    it('should find items with $not operator', () => {
      const query: Query = {
        price: { $not: { $gt: 150 } },
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 3]));
    });

    it('should find items with nested logical operators', () => {
      const query: Query = {
        $or: [
          {
            $and: [
              { price: { $lt: 150 } },
              { categories: { $in: ['electronics'] } },
            ],
          },
          { 'stock.warehouse2': { $gt: 35 } },
        ],
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 2]));
    });

    it('should handle empty $and array', () => {
      const query: Query = { $and: [] };
      const result = qubo.find(query);
      expect(result).toEqual(testData);
    });

    it('should handle empty $or array', () => {
      const query: Query = { $or: [] };
      const result = qubo.find(query);
      expect(result).toEqual([]);
    });

    it('should handle non-array argument for $and', () => {
      const query: Query = { $and: 'not an array' as any };
      expect(() => qubo.find(query)).toThrow('[qubo] $and requires an array as its argument');
    });

    it('should handle non-array argument for $or', () => {
      const query: Query = { $or: 'not an array' as any };
      expect(() => qubo.find(query)).toThrow('[qubo] $or requires an array as its argument');
    });

    it('should handle non-object argument for $not', () => {
      const query: Query = { $not: 'not an object' as any };
      expect(() => qubo.find(query)).toThrow('[qubo] $not requires an object as its argument');
    });

    it('should handle $nor operator', () => {
      const query: Query = {
        $nor: [
          { price: { $lte: 150 } },
          { categories: { $in: ['electronics'] } },
        ],
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should handle empty $nor array', () => {
      const query: Query = { $nor: [] };
      const result = qubo.find(query);
      expect(result).toEqual(testData);
    });

    it('should handle non-array argument for $nor', () => {
      const query: Query = { $nor: 'not an array' as any };
      expect(() => qubo.find(query)).toThrow('[qubo] $nor requires an array as its argument');
    });
  });

  describe('Error Cases', () => {
    it('should throw error for invalid data type', () => {
      expect(() => createQubo('not an array' as unknown as unknown[])).toThrow('Data must be an array');
    });

    it('should throw error for invalid query type', () => {
      expect(() => qubo.find('not an object' as unknown as Query)).toThrow('Query must be an object');
      expect(() => qubo.findOne('not an object' as unknown as Query)).toThrow('Query must be an object');
      expect(() => qubo.evaluate('not an object' as unknown as Query)).toThrow('Query must be an object');
    });

    it('should throw error for unknown operator', () => {
      const query: Query = {
        price: { $unknown: 100 },
      };
      expect(() => qubo.find(query)).toThrow('Unknown operator: $unknown');
    });

    it('should throw error for invalid $in argument', () => {
      const query: Query = {
        categories: { $in: 'not an array' },
      };
      expect(() => qubo.find(query)).toThrow('$in requires an array as its argument');
    });

    it('should throw error for invalid $elemMatch argument', () => {
      const query: Query = {
        specs: { $elemMatch: 'not an object' },
      };
      expect(() => qubo.find(query)).toThrow('$elemMatch requires an object as its argument');
    });

    it('should throw error for invalid $regex argument', () => {
      const query: Query = {
        name: { $regex: 123 },
      };
      expect(() => qubo.find(query)).toThrow('$regex requires a string or RegExp as its argument');
    });
  });

  describe('findOne and evaluate Tests', () => {
    it('should find first matching item with findOne', () => {
      const query: Query = { categories: { $in: ['electronics'] } };
      const result = qubo.findOne(query);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it('should return null when no match found with findOne', () => {
      const query: Query = { name: 'Non Existent Product' };
      const result = qubo.findOne(query);
      expect(result).toBeNull();
    });

    it('should return true when matching item exists with evaluate', () => {
      const query: Query = { price: { $gt: 150 } };
      const result = qubo.evaluate(query);
      expect(result).toBe(true);
    });

    it('should return false when no matching item exists with evaluate', () => {
      const query: Query = { price: { $gt: 1000 } };
      const result = qubo.evaluate(query);
      expect(result).toBe(false);
    });

    it('should evaluate complex queries correctly', () => {
      const query: Query = {
        $and: [
          { price: { $gte: 100 } },
          { 'stock.warehouse1': { $gt: 0 } },
          { specs: { $elemMatch: { key: 'size', value: { $in: ['medium', 'large'] } } } },
        ],
      };
      const result = qubo.evaluate(query);
      expect(result).toBe(true);
    });
  });

  describe('Array Index and Dot Notation Tests', () => {
    it('should query array indices with bracket notation', () => {
      const query: Query = { 'specs[0].key': 'color' };
      const result = qubo.find(query);
      expect(result).toHaveLength(3);
      expect(result.map(item => item.id)).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it('should handle invalid array indices', () => {
      const query: Query = { 'specs[5].key': 'color' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle invalid array access on non-array', () => {
      const query: Query = { 'name[0]': 'P' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle deep array indices', () => {
      const query: Query = { 'specs[0].value': 'black' };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe('Custom Operator Tests', () => {
    it('should allow registering custom operators', () => {
      const customQubo = createQubo(testData, {
        operators: {
          $startsWith: (value: unknown, operand: unknown) => {
            if (typeof value !== 'string' || typeof operand !== 'string') {
              return false;
            }
            return value.startsWith(operand);
          },
        },
      });

      const query: Query = { name: { $startsWith: 'Product' } };
      const result = customQubo.find(query);
      expect(result).toHaveLength(3);
    });

    it('should throw error for invalid custom operator name', () => {
      expect(() =>
        createQubo(testData, {
          operators: {
            startsWith: () => true,
          },
        }),
      ).toThrow('Invalid operator name: startsWith. Operator names must start with \'$\'');
    });

    it('should allow registering operators after creation', () => {
      const customQubo = createQubo(testData);
      customQubo.registerOperator('$endsWith', (value: unknown, operand: unknown) => {
        if (typeof value !== 'string' || typeof operand !== 'string') {
          return false;
        }
        return value.endsWith(operand);
      });

      const query: Query = { name: { $endsWith: 'A' } };
      const result = customQubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should throw error for invalid operator name when registering', () => {
      const customQubo = createQubo(testData);
      expect(() =>
        customQubo.registerOperator('invalidName', () => true),
      ).toThrow('Invalid operator name: invalidName. Operator names must start with \'$\'');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values in documents', () => {
      const dataWithNull = [...testData, { id: 4, name: null, price: 50 }];
      const nullQubo = createQubo(dataWithNull);

      const query: Query = { name: null };
      const result = nullQubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });

    it('should handle undefined values in documents', () => {
      const dataWithUndefined = [...testData, { id: 4, price: 50 }];
      const undefinedQubo = createQubo(dataWithUndefined);

      const query: Query = { name: { $exists: false } };
      const result = undefinedQubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });

    it('should handle empty objects in query', () => {
      const query: Query = { specs: { $elemMatch: {} } };
      const result = qubo.find(query);
      expect(result).toHaveLength(3);
      expect(result.map(item => item.id)).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it('should handle non-existent paths', () => {
      const query: Query = { 'nonexistent.path': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });
  });
});
