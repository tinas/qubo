import { createQubo } from '../qubo';

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

describe('Qubo', () => {
  let qubo: ReturnType<typeof createQubo<typeof testData[0]>>;

  beforeEach(() => {
    qubo = createQubo(testData);
  });

  describe('Query Operations', () => {
    it('should find items with basic operators', () => {
      // Exact match
      expect(qubo.find({ id: 1 })).toHaveLength(1);
      expect(qubo.find({ name: { $eq: 'Product B' } })).toHaveLength(1);
      expect(qubo.find({ name: 'Non Existent' })).toHaveLength(0);

      // Comparison operators
      expect(qubo.find({ price: { $gt: 150 } })).toHaveLength(1);
      expect(qubo.find({ price: { $gte: 150 } })).toHaveLength(2);
      expect(qubo.find({ price: { $lt: 150 } })).toHaveLength(1);
      expect(qubo.find({ name: { $regex: 'Product [AB]' } })).toHaveLength(2);
      expect(qubo.find({ name: { $exists: true } })).toHaveLength(3);

      // Array operators
      expect(qubo.find({ categories: { $in: ['electronics'] } })).toHaveLength(2);
      expect(qubo.find({ categories: { $nin: ['clothing'] } })).toHaveLength(2);
      expect(qubo.find({ specs: { $elemMatch: { key: 'color', value: 'black' } } })).toHaveLength(1);
    });

    it('should handle logical operators', () => {
      expect(qubo.find({ 
        $and: [
          { price: { $gt: 100 } }, 
          { categories: { $in: ['electronics'] } }
        ] 
      })).toHaveLength(1);

      expect(qubo.find({ 
        $or: [
          { price: 200 }, 
          { 'stock.warehouse1': 0 }
        ] 
      })).toHaveLength(2);

      expect(qubo.find({ 
        price: { $not: { $gt: 150 } }
      })).toHaveLength(2);

      expect(qubo.find({ 
        $nor: [
          { price: { $lte: 150 } }, 
          { categories: { $in: ['electronics'] } }
        ] 
      })).toHaveLength(1);
    });

    it('should support alternative query methods', () => {
      expect(qubo.findOne({ categories: { $in: ['electronics'] } })).toHaveProperty('id', 1);
      expect(qubo.findOne({ name: 'Non Existent' })).toBeNull();
      expect(qubo.evaluate({ price: { $gt: 150 } })).toBe(true);
      expect(qubo.evaluate({ price: { $gt: 1000 } })).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should throw appropriate errors', () => {
      expect(() => createQubo('not an array' as any)).toThrow('Data must be an array');
      expect(() => qubo.find('not an object' as any)).toThrow('Query must be an object');
      expect(() => qubo.find({ price: { $unknown: 100 } })).toThrow('Unknown operator: $unknown');
      expect(() => qubo.find({ categories: { $in: 'not an array' } })).toThrow('$in requires an array as its argument');
      expect(() => qubo.find({ specs: { $elemMatch: 'not an object' } })).toThrow('$elemMatch requires an object as its argument');
      expect(() => qubo.find({ name: { $regex: 123 } })).toThrow('$regex requires a string or RegExp as its argument');
    });
  });

  describe('Extensions and Edge Cases', () => {
    it('should support custom operators', () => {
      const customQubo = createQubo(testData, {
        operators: {
          $startsWith: (value: unknown, operand: unknown) => {
            if (typeof value !== 'string' || typeof operand !== 'string') return false;
            return value.startsWith(operand);
          },
        },
      });

      expect(customQubo.find({ name: { $startsWith: 'Product' } })).toHaveLength(3);
      expect(() => createQubo(testData, {
        operators: { invalidName: () => true },
      })).toThrow('Invalid operator name: invalidName');
    });

    it('should handle special values and cases', () => {
      // Null and undefined
      const dataWithNull = [...testData, { id: 4, name: null, price: 50 }];
      expect(createQubo(dataWithNull).find({ name: null })).toHaveLength(1);

      const dataWithUndefined = [...testData, { id: 4, price: 50 }];
      expect(createQubo(dataWithUndefined).find({ name: { $exists: false } })).toHaveLength(1);

      // Empty values
      expect(qubo.find({ $and: [] })).toEqual(testData);
      expect(qubo.find({ $or: [] })).toEqual([]);
      expect(qubo.find({ specs: { $elemMatch: {} } })).toHaveLength(3);

      // Non-existent paths
      expect(qubo.find({ 'nonexistent.path': 'value' })).toHaveLength(0);
      expect(qubo.find({ 'specs[5].key': 'value' })).toHaveLength(0);
      expect(qubo.find({ 'name[0]': 'P' })).toHaveLength(0);
    });
  });
});
