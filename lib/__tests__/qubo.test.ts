import { createQubo } from '../qubo';
import type { Query } from '../types';
import { $and, $or, $not, $nor } from '../operators/logical';
import { $elemMatch as $elementMatch } from '../operators/array';

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
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 2, 3]));
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
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 2, 3]));
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
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 2, 3]));
    });

    it('should handle non-existent paths', () => {
      const query: Query = { 'nonexistent.path': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });
  });

  describe('Path Resolution Tests', () => {
    it('should handle empty path', () => {
      const query: Query = { '': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle path with only dots', () => {
      const query: Query = { '...': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle path with invalid array syntax', () => {
      const query: Query = { 'specs[abc].key': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle path with unclosed bracket', () => {
      const query: Query = { 'specs[0.key': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle path with negative array index', () => {
      const query: Query = { 'specs[-1].key': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle deeply nested paths that become undefined', () => {
      const query: Query = { 'stock.warehouse1.inventory.zone.shelf': 'A1' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });
  });

  describe('Complex Query Tests', () => {
    it('should handle queries with multiple operators at the same level', () => {
      const query: Query = {
        price: { $gt: 100, $lt: 200 },
        categories: { $in: ['electronics'], $nin: ['clothing'] },
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('should handle deeply nested logical operators', () => {
      const query: Query = {
        $and: [
          {
            $or: [
              { price: { $lt: 150 } },
              { price: { $gt: 180 } },
            ],
          },
          {
            $nor: [
              { categories: { $in: ['clothing'] } },
              { 'stock.warehouse1': 0 },
            ],
          },
        ],
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should handle queries with array indices and operators', () => {
      const query: Query = {
        specs: {
          $elemMatch: {
            key: 'color',
            value: { $in: ['black', 'red'] },
          },
        },
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(2);
      expect(result.map((item) => item.id)).toEqual(expect.arrayContaining([1, 2]));
    });

    it('should handle null query values', () => {
      const query: Query = { name: { $eq: null } };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle undefined query values', () => {
      const query: Query = { name: { $eq: undefined } };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle non-object values in document', () => {
      type TestData = typeof testData[0];
      const dataWithPrimitive = [...testData, 'not an object'];
      const primitiveQubo = createQubo(dataWithPrimitive);

      const query: Query = { id: 1 };
      const result = primitiveQubo.find(query);
      expect(result).toHaveLength(1);
      expect((result[0] as TestData).id).toBe(1);
    });

    it('should handle non-object values in array fields', () => {
      const dataWithPrimitiveArray = [
        {
          id: 1,
          tags: ['tag1', 'tag2'],
          mixedArray: [1, 'string', { key: 'value' }],
        },
      ];
      const mixedQubo = createQubo(dataWithPrimitiveArray);

      const query: Query = { 'mixedArray[0]': 1 };
      const result = mixedQubo.find(query);
      expect(result).toHaveLength(1);
    });

    it('should handle array access on primitive values', () => {
      const query: Query = { 'price[0]': 1 };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle dot notation on primitive values', () => {
      const query: Query = { 'price.value': 100 };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle array indices in non-array fields', () => {
      const query: Query = { 'name[0]': 'P' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle empty path segments', () => {
      const query: Query = { 'stock.nonexistent.warehouse1': 0 };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle consecutive array indices', () => {
      const query: Query = { 'specs[0][1].key': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle array indices without closing bracket', () => {
      const query: Query = { 'specs[0key': 'color' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle invalid array index values', () => {
      const query: Query = { 'specs[abc].key': 'value' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle undefined values in array fields', () => {
      const dataWithUndefined = [
        {
          id: 1,
          array: [1, undefined, 3],
        },
      ];
      const undefinedQubo = createQubo(dataWithUndefined);

      const query: Query = { 'array[1]': undefined };
      const result = undefinedQubo.find(query);
      expect(result).toHaveLength(1);
    });
  });

  describe('Advanced Error Handling', () => {
    it('should handle non-object query values', () => {
      const query = { price: undefined } as Query;
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle non-object query values with operators', () => {
      const query = { price: { $gt: undefined } } as Query;
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle null query values with operators', () => {
      const query = { price: { $gt: null } } as Query;
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle array fields with non-object values', () => {
      const query: Query = {
        categories: {
          $elemMatch: 'electronics',
        },
      };
      expect(() => qubo.find(query)).toThrow('[qubo] $elemMatch requires an object as its argument');
    });

    it('should handle array fields with null values', () => {
      const query: Query = {
        categories: {
          $elemMatch: null,
        },
      };
      expect(() => qubo.find(query)).toThrow('[qubo] $elemMatch requires an object as its argument');
    });

    it('should handle array fields with undefined values', () => {
      const query: Query = {
        categories: {
          $elemMatch: undefined,
        },
      };
      expect(() => qubo.find(query)).toThrow('[qubo] $elemMatch requires an object as its argument');
    });

    it('should handle deeply nested paths with array indices', () => {
      const query: Query = {
        'stock.warehouse1.inventory[0].zone[1].shelf': 'A1',
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle paths with invalid array indices', () => {
      const query: Query = {
        'specs[-1].key': 'color',
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle paths with non-numeric array indices', () => {
      const query: Query = {
        'specs[abc].key': 'color',
      };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle paths with unclosed array brackets', () => {
      const query: Query = { 'specs[0key': 'color' };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });
  });

  describe('Array Operator Edge Cases', () => {
    it('should handle $in with array values and no matches', () => {
      const query: Query = { categories: { $in: ['sports', 'books'] } };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle $in with empty array value', () => {
      const dataWithEmpty = [...testData, { id: 4, categories: [], price: 50 }];
      const emptyQubo = createQubo(dataWithEmpty);

      const query: Query = { categories: { $in: ['electronics'] } };
      const result = emptyQubo.find(query);
      expect(result).toHaveLength(2);
    });

    it('should handle $in with empty operand array', () => {
      const query: Query = { categories: { $in: [] } };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle $nin with array values and all matches', () => {
      const query: Query = { categories: { $nin: ['sports', 'books'] } };
      const result = qubo.find(query);
      expect(result).toHaveLength(3);
    });

    it('should handle $nin with empty array value', () => {
      const dataWithEmpty = [...testData, { id: 4, categories: [], price: 50 }];
      const emptyQubo = createQubo(dataWithEmpty);

      const query: Query = { categories: { $nin: ['electronics'] } };
      const result = emptyQubo.find(query);
      expect(result).toHaveLength(2);
    });

    it('should handle $nin with empty operand array', () => {
      const query: Query = { categories: { $nin: [] } };
      const result = qubo.find(query);
      expect(result).toHaveLength(3);
    });

    it('should handle $elemMatch with non-array values', () => {
      const query: Query = { price: { $elemMatch: { $gt: 100 } } };
      const result = qubo.find(query);
      expect(result).toHaveLength(0);
    });

    it('should handle $elemMatch with empty array values', () => {
      const dataWithEmpty = [...testData, { id: 4, specs: [], price: 50 }];
      const emptyQubo = createQubo(dataWithEmpty);

      const query: Query = {
        specs: {
          $elemMatch: {
            key: 'color',
          },
        },
      };
      const result = emptyQubo.find(query);
      expect(result).toHaveLength(3);
    });

    it('should handle $elemMatch with empty object operand', () => {
      const query: Query = { specs: { $elemMatch: {} } };
      const result = qubo.find(query);
      expect(result).toHaveLength(3);
    });

    it('should handle $elemMatch with primitive array values', () => {
      const dataWithPrimitives = [{ id: 1, numbers: [1, 2, 3] }];
      const primitiveQubo = createQubo(dataWithPrimitives);

      const query: Query = {
        numbers: {
          $elemMatch: { $gt: 2 },
        },
      };
      const result = primitiveQubo.find(query);
      expect(result).toHaveLength(1);
    });

    it('should handle $elemMatch with array of arrays', () => {
      const dataWithArrays = [{ id: 1, matrix: [[1, 2], [3, 4]] }];
      const arrayQubo = createQubo(dataWithArrays);

      const query: Query = {
        matrix: {
          $elemMatch: { $elemMatch: { $gt: 3 } },
        },
      };
      const result = arrayQubo.find(query);
      expect(result).toHaveLength(1);
    });

    it('should handle $elemMatch with null values in array', () => {
      const dataWithNull = [{ id: 1, items: [null, { value: 1 }, { value: 2 }] }];
      const nullQubo = createQubo(dataWithNull);

      const query: Query = {
        items: {
          $elemMatch: { value: { $gt: 1 } },
        },
      };
      const result = nullQubo.find(query);
      expect(result).toHaveLength(1);
    });
  });

  describe('Path Resolution Edge Cases', () => {
    it('should handle non-object values in path resolution', () => {
      const data = [{ a: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ 'a.b': 1 });
      expect(result).toHaveLength(0);
    });

    it('should handle array access on undefined values', () => {
      const data = [{ a: undefined }];
      const qubo = createQubo(data);
      const result = qubo.find({ 'a[0]': 1 });
      expect(result).toHaveLength(0);
    });

    it('should handle array access on null values', () => {
      const data = [{ a: null }];
      const qubo = createQubo(data);
      const result = qubo.find({ 'a[0]': 1 });
      expect(result).toHaveLength(0);
    });
  });

  describe('Value Evaluation Edge Cases', () => {
    it('should handle non-object values in query evaluation', () => {
      const data = [{ a: 1 }];
      const qubo = createQubo(data);
      const result = qubo.find({ a: null });
      expect(result).toHaveLength(0);
    });

    it('should handle undefined values in query evaluation', () => {
      const data = [{ a: undefined }];
      const qubo = createQubo(data);
      const result = qubo.find({ a: undefined });
      expect(result).toHaveLength(1);
    });

    it('should handle null values in query evaluation', () => {
      const data = [{ a: null }];
      const qubo = createQubo(data);
      const result = qubo.find({ a: null });
      expect(result).toHaveLength(1);
    });
  });

  describe('Document Evaluation Edge Cases', () => {
    it('should handle $elemMatch on non-array documents', () => {
      const data = [{ items: 'not an array' }];
      const qubo = createQubo(data);
      const result = qubo.find({ items: { $elemMatch: { a: 1 } } });
      expect(result).toHaveLength(0);
    });

    it('should handle $elemMatch with empty query', () => {
      const data = [{ items: [{ a: 1 }] }];
      const qubo = createQubo(data);
      const result = qubo.find({ items: { $elemMatch: {} } });
      expect(result).toHaveLength(1);
    });

    it('should handle unknown operators in document evaluation', () => {
      const data = [{ a: 1 }];
      const qubo = createQubo(data);
      expect(() => qubo.find({ $unknownOp: 1 })).toThrow('Unknown operator: $unknownOp');
    });
  });

  describe('Comparison Operator Edge Cases', () => {
    it('should handle type mismatches in $gt operator', () => {
      const data = [{ value: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ value: { $gt: 'string' } });
      expect(result).toHaveLength(0);
    });

    it('should handle type mismatches in $gte operator', () => {
      const data = [{ value: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ value: { $gte: 'string' } });
      expect(result).toHaveLength(0);
    });

    it('should handle type mismatches in $lt operator', () => {
      const data = [{ value: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ value: { $lt: 'string' } });
      expect(result).toHaveLength(0);
    });

    it('should handle type mismatches in $lte operator', () => {
      const data = [{ value: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ value: { $lte: 'string' } });
      expect(result).toHaveLength(0);
    });

    it('should handle non-string values in $regex operator', () => {
      const data = [{ value: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ value: { $regex: 'pattern' } });
      expect(result).toHaveLength(0);
    });
  });

  describe('Logical Operator Edge Cases', () => {
    it('should handle missing evaluate function in $and', () => {
      expect(() => {
        $and({ value: 5 }, [{ value: 5 }]);
      }).toThrow('$and requires an evaluate function');
    });

    it('should handle missing evaluate function in $or', () => {
      expect(() => {
        $or({ value: 5 }, [{ value: 5 }]);
      }).toThrow('$or requires an evaluate function');
    });

    it('should handle missing evaluate function in $not', () => {
      expect(() => {
        $not({ value: 5 }, { value: 5 });
      }).toThrow('$not requires an evaluate function');
    });

    it('should handle missing evaluate function in $nor', () => {
      expect(() => {
        $nor({ value: 5 }, [{ value: 5 }]);
      }).toThrow('$nor requires an evaluate function');
    });

    it('should handle non-object conditions in $and', () => {
      const data = [{ value: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ $and: [null] });
      expect(result).toHaveLength(0);
    });

    it('should handle non-object conditions in $or', () => {
      const data = [{ value: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ $or: [null] });
      expect(result).toHaveLength(0);
    });

    it('should handle non-object conditions in $nor', () => {
      const data = [{ value: 5 }];
      const qubo = createQubo(data);
      const result = qubo.find({ $nor: [null] });
      expect(result).toHaveLength(1);
    });
  });

  describe('Array Operator Advanced Cases', () => {
    it('should handle array values in $in operator', () => {
      const data = [
        { tags: ['red', 'blue'] },
        { tags: ['green', 'yellow'] },
      ];
      const qubo = createQubo(data);
      const result = qubo.find({ tags: { $in: ['red', 'green'] } });
      expect(result).toHaveLength(2);
    });

    it('should handle array values in $nin operator', () => {
      const data = [
        { tags: ['red', 'blue'] },
        { tags: ['green', 'yellow'] },
      ];
      const qubo = createQubo(data);
      const result = qubo.find({ tags: { $nin: ['purple', 'orange'] } });
      expect(result).toHaveLength(2);
    });

    it('should handle array values in $in operator with no matches', () => {
      const data = [
        { tags: ['red', 'blue'] },
        { tags: ['green', 'yellow'] },
      ];
      const qubo = createQubo(data);
      const result = qubo.find({ tags: { $in: ['purple', 'orange'] } });
      expect(result).toHaveLength(0);
    });

    it('should handle array values in $nin operator with matches', () => {
      const data = [
        { tags: ['red', 'blue'] },
        { tags: ['green', 'yellow'] },
      ];
      const qubo = createQubo(data);
      const result = qubo.find({ tags: { $nin: ['red', 'green'] } });
      expect(result).toHaveLength(0);
    });

    it('should handle array values in $in operator with array field', () => {
      const data = [
        { tags: ['red', 'blue'] },
        { tags: ['green', 'yellow'] },
      ];
      const qubo = createQubo(data);
      const result = qubo.find({ tags: { $in: ['red'] } });
      expect(result).toHaveLength(1);
    });

    it('should handle array values in $nin operator with array field', () => {
      const data = [
        { tags: ['red', 'blue'] },
        { tags: ['green', 'yellow'] },
      ];
      const qubo = createQubo(data);
      const result = qubo.find({ tags: { $nin: ['red'] } });
      expect(result).toHaveLength(1);
    });

    it('should handle missing evaluate function in $elemMatch', () => {
      const items = [{ value: 1 }, { value: 2 }];
      expect(() => {
        // @ts-ignore - Testing runtime behavior
        $elementMatch(items, { value: 1 });
      }).toThrow('$elemMatch requires an evaluate function');
    });
  });

  describe('Internal Function Tests', () => {
    it('should validate operator names correctly', () => {
      const data = [{ value: 1 }];
      const qubo = createQubo(data);
      expect(() => {
        qubo.registerOperator('invalidName', () => true);
      }).toThrow('Invalid operator name: invalidName. Operator names must start with \'$\'');
    });

    it('should handle empty path in resolvePath', () => {
      const data = [{ value: 1 }];
      const qubo = createQubo(data);
      const result = qubo.find({ '': 1 });
      expect(result).toHaveLength(0);
    });

    it('should handle path with only dots', () => {
      const data = [{ value: 1 }];
      const qubo = createQubo(data);
      const result = qubo.find({ '...': 1 });
      expect(result).toHaveLength(0);
    });

    it('should handle path with invalid array syntax', () => {
      const data = [{ value: 1 }];
      const qubo = createQubo(data);
      const result = qubo.find({ 'value[abc]': 1 });
      expect(result).toHaveLength(0);
    });

    it('should handle non-object values in evaluateValue with operators', () => {
      const data = [{ value: 1 }];
      const qubo = createQubo(data);
      const result = qubo.find({ value: { $gt: null } });
      expect(result).toHaveLength(0);
    });

    it('should handle non-object values in evaluateValue with dot notation', () => {
      const data = [{ value: 1 }];
      const qubo = createQubo(data);
      const result = qubo.find({ 'value.nested': 1 });
      expect(result).toHaveLength(0);
    });

    it('should handle non-object values in evaluateDocument with operators', () => {
      const data = [{ value: 1 }];
      const qubo = createQubo(data);
      const result = qubo.find({ $and: [null] });
      expect(result).toHaveLength(0);
    });

    it('should handle non-object values in evaluateDocument with dot notation', () => {
      const data = [{ value: 1 }];
      const qubo = createQubo(data);
      const result = qubo.find({ 'value.nested': { $gt: 1 } });
      expect(result).toHaveLength(0);
    });

    it('should handle non-object values in evaluateDocument with $elemMatch', () => {
      const data = [{ items: 'not an array' }];
      const qubo = createQubo(data);
      const result = qubo.find({ items: { $elemMatch: { value: 1 } } });
      expect(result).toHaveLength(0);
    });

    it('should handle non-object values in evaluateDocument with array indices', () => {
      const data = [{ items: 'not an array' }];
      const qubo = createQubo(data);
      const result = qubo.find({ 'items[0]': 1 });
      expect(result).toHaveLength(0);
    });
  });
});
