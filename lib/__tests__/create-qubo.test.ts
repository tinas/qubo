/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/consistent-function-scoping */
import { createQubo } from '../';
import { OperatorFunction } from '../types';

describe('Qubo Tests', () => {
  interface Product {
    id: number;
    name: string;
    qty: number;
    instock?: Array<{ warehouse: string; qty: number }>;
    tags?: string[];
    extra?: any;
  }

  const data: Product[] = [
    {
      id: 1,
      name: 'journal',
      qty: 5,
      instock: [
        { warehouse: 'A', qty: 5 },
        { warehouse: 'C', qty: 15 },
      ],
      tags: ['stationery', 'paper'],
    },
    {
      id: 2,
      name: 'notebook',
      qty: 10,
      instock: [{ warehouse: 'C', qty: 5 }],
      tags: ['paper'],
    },
    {
      id: 3,
      name: 'paper',
      qty: 60,
      instock: [
        { warehouse: 'A', qty: 60 },
        { warehouse: 'B', qty: 15 },
      ],
      tags: ['bulk', 'stationery'],
    },
    {
      id: 4,
      name: 'planner',
      qty: 40,
      instock: [
        { warehouse: 'A', qty: 40 },
        { warehouse: 'B', qty: 5 },
      ],
      tags: ['bulk'],
    },
    {
      id: 5,
      name: 'postcard',
      qty: 15,
      instock: [
        { warehouse: 'B', qty: 15 },
        { warehouse: 'C', qty: 35 },
      ],
    },
  ];

  let qubo = createQubo<Product>(data);

  beforeEach(() => {
    qubo = createQubo<Product>(data);
  });

  // --------------------------------------------------
  // Basic find
  // --------------------------------------------------
  it('should find documents with basic eq on a primitive field', () => {
    const result = qubo.find({ qty: 5 });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('journal');
  });

  it('should findOne document with nested eq on array field', () => {
    const document = qubo.findOne({
      'instock.qty': 15,
    });
    // "journal" => instock.qty => [5,15], "paper" => [60,15], "postcard" => [15,35]
    // findOne => first matched is "journal"
    expect(document?.id).toBe(1);
  });

  // --------------------------------------------------
  // $gt, $gte, $lt, $lte, $ne
  // --------------------------------------------------
  it('should handle $gt and $lte operators on primitive fields', () => {
    const result = qubo.find({
      qty: { $gt: 10, $lte: 40 },
    });
    // qty > 10 and qty <= 40 => "planner" (40) "postcard"(15)
    // "notebook"(10) no, "paper"(60) no => result => [planner(40), postcard(15)]
    expect(result.length).toBe(2);
    const ids = result.map((d) => d.id).sort();
    expect(ids).toEqual([4, 5]);
  });

  it('should handle $ne on array flatten', () => {
    // Finding docs without 'paper' in tags
    // 'paper' => #1-> [stationery, paper], #2-> [paper], #3-> [bulk, stationery], #4-> [bulk], #5-> undefined
    // $ne => "paper" =>
    // => doc1 => tags => [stationery, paper], some(...) eq => true => so $ne => false => doc1 excluded
    // => doc2 => tags => [paper] => excluded
    // => doc3 => [bulk, stationery] => no "paper" => included
    // => doc4 => [bulk] => included
    // => doc5 => undefined => no includes => included
    const result = qubo.find({
      'tags': { $ne: 'paper' },
    });
    const names = result.map((x) => x.name).sort();
    expect(names).toEqual(['paper', 'planner', 'postcard']);
  });

  it('should return false if $gt used with non-numeric conditionValue', () => {
    // 'qty': { $gt: "not-a-number" }
    // code path: typeof conditionValue !== 'number' => false
    const result = qubo.find({
      qty: { $gt: 'not-a-number' } as any,
    });
    // All docs are false => result => []
    expect(result).toHaveLength(0);
  });

  it('should handle array field but non-numeric elements in $gt', () => {
    // Overwrite data with a doc that has array of mixed
    const customData = [
      { id: 999, name: 'mixed', qty: ['a', 10, true] as any },
    ];
    const qb = createQubo(customData);
    // "qty": { $gt: 5 } => "a" => not a number, 10 => number>5 => true => doc match
    const result = qb.find({
      qty: { $gt: 5 },
    });
    expect(result).toHaveLength(1);
  });

  it('should return false for $gt if array is numeric but none > condition', () => {
    const document = { id: 300, nums: [1, 2, 3] };
    const qb = createQubo([document]);
    const result = qb.find({
      nums: { $gt: 5 }, // none are > 5 => false
    });
    expect(result).toHaveLength(0);
  });

  // --------------------------------------------------
  // $in, $nin
  // --------------------------------------------------
  it('should handle $in', () => {
    // $in: [10, 60]
    // => doc2(qty=10) or doc3(qty=60)
    const result = qubo.find({
      qty: { $in: [10, 60] },
    });
    expect(result.length).toBe(2);
    const ids = result.map((d) => d.id).sort();
    expect(ids).toEqual([2, 3]);
  });

  it('should handle $nin with array fields', () => {
    // $nin => searching in "tags" => doc that doesn't have any of ["stationery", "paper"]
    // doc1(tags: [stationery, paper]) => intersects => so $nin => false
    // doc2(tags: [paper]) => intersects => false
    // doc3(tags: [bulk, stationery]) => intersects => false
    // doc4(tags: [bulk]) => no intersection => true => included
    // doc5(tags: undefined) => no intersection => true => included
    const result = qubo.find({
      tags: { $nin: ['stationery', 'paper'] },
    });
    expect(result.length).toBe(2);
    expect(result.map((d) => d.id).sort()).toEqual([4, 5]);
  });

  it('should return false if $in is used with conditionValue that is not an array', () => {
    const result = qubo.find({
      qty: { $in: 10 as any },
    });
    // $in => if (!Array.isArray(conditionValue)) => false => no match
    expect(result).toHaveLength(0);
  });

  it('should return false if $nin is used with conditionValue that is not an array', () => {
    const result = qubo.find({
      'instock.warehouse': { $nin: 'A' as any },
    });
    // => false => no doc matched => length=0
    expect(result).toHaveLength(0);
  });

  // --------------------------------------------------
  // $elemMatch
  // --------------------------------------------------
  it('should handle $elemMatch for single subquery', () => {
    // "instock": { $elemMatch: { warehouse: "A", qty: 5 } }
    const result = qubo.find({
      instock: {
        $elemMatch: { warehouse: 'A', qty: 5 },
      },
    });
    // doc1 => { warehouse:'A', qty:5 } => match
    // doc2 => { warehouse:'C', qty:5 } => no 'A'
    // doc3 => {warehouse:'A', qty:60} => no
    // doc4 => {warehouse:'A', qty:40} => no
    // doc5 => {warehouse:'B', qty:15}, {warehouse:'C', qty:35} => no
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });

  it('should handle $elemMatch with operator inside subquery', () => {
    // "instock": { $elemMatch: { warehouse: "C", qty: { $lt: 10 } } }
    // Looking for an element with warehouse='C' and qty<10
    // doc1 => 'C',15 => no
    // doc2 => 'C',5 => yes => match
    // doc3 => 'B',15 => no => or 'A',60 => no
    // doc4 => 'A',40 or 'B',5 => no 'C'
    // doc5 => 'B',15 or 'C',35 => 'C',35 => not <10 => no
    const result = qubo.find({
      instock: {
        $elemMatch: {
          warehouse: 'C',
          qty: { $lt: 10 },
        },
      },
    });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('notebook');
  });

  it('should return false if $elemMatch fieldValue is not an array', () => {
    // Insert doc with "instock" = null or a string
    const qb = createQubo([{ id: 201, instock: 'not-an-array' } as any]);
    const result = qb.find({
      instock: {
        $elemMatch: { qty: 5 },
      },
    });
    // line "if (!Array.isArray(fieldValue)) return false" => triggers
    expect(result).toHaveLength(0);
  });

  // --------------------------------------------------
  // Logical operators: $and, $or
  // --------------------------------------------------
  it('should handle $and properly', () => {
    const result = qubo.find({
      $and: [
        { 'instock.qty': { $gte: 15 } },
        { 'instock.warehouse': 'C' },
      ],
    });
    // This means: doc's instock array has some qty >=15, and some warehouse='C'
    // - doc1 => qty => [5,15], 15>=15 => yes, warehouse => [A,C] => yes => match
    // - doc2 => qty => [5], not >=15 => no => skip
    // - doc3 => qty => [60,15], 60>=15 => yes, warehouse => [A,B] => no => skip
    // - doc4 => qty => [40,5], 40>=15 => yes, warehouse => [A,B] => no => skip
    // - doc5 => qty => [15,35], 15>=15 => yes, warehouse=>[B,C] => yes => match
    // => doc1, doc5
    expect(result.length).toBe(2);
    const ids = result.map((d) => d.id).sort();
    expect(ids).toEqual([1, 5]);
  });

  it('should throw error if $and is not an array', () => {
    expect(() => {
      qubo.find({
        $and: { invalid: 'object' },
      } as any);
    }).toThrow('$and expects an array of queries.');
  });

  it('should handle $or properly', () => {
    // $or => either name='journal' or qty < 10
    const result = qubo.find({
      $or: [
        { name: 'journal' },
        { qty: { $lt: 10 } },
      ],
    });
    // doc1 => name='journal' => match
    // doc2 => qty=10 => not <10 => skip
    // doc3 => qty=60 => skip
    // doc4 => qty=40 => skip
    // doc5 => qty=15 => skip
    // => only doc1
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });

  it('should throw error if $or is not an array', () => {
    expect(() => {
      qubo.find({
        $or: { invalid: 'object' },
      } as any);
    }).toThrow('$or expects an array of queries.');
  });

  it('should skip invalid subQuery in $or array (branch coverage)', () => {
    const result = qubo.find({
      $or: [
        null,
        { qty: 5 },
      ] as any,
    });
    // doc => { qty:5 } => "journal" => matched
    // but first subQuery is null => handleOr => returns false for that subQuery
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('journal');
  });

  // --------------------------------------------------
  // Evaluate -> boolean[], some, every, evaluateOne
  // --------------------------------------------------
  it('should evaluate to boolean[] for each doc', () => {
    const bools = qubo.evaluate({ 'instock.qty': 5 });
    // doc1 => instock.qty => [5,15] => has 5 => true
    // doc2 => [5] => true
    // doc3 => [60,15] => no => false
    // doc4 => [40,5] => has 5 => true
    // doc5 => [15,35] => no => false
    expect(bools).toEqual([true, true, false, true, false]);
  });

  it('should evaluateOne single doc', () => {
    // doc => { qty:10, name:'notebook' }
    // query => { qty: 10 }
    const document = data[1]; // notebook
    // "doc" does match { qty:10 } => true
    const ok = qubo.evaluateOne(document, { qty: 10 });
    expect(ok).toBe(true);

    // mismatch
    expect(qubo.evaluateOne(document, { qty: 999 })).toBe(false);
  });

  // --------------------------------------------------
  // Error Paths (unsupported operators, missing eq, etc.)
  // --------------------------------------------------
  it('should throw error for unsupported operator in field-based query', () => {
    expect(() => {
      qubo.find({
        qty: { $invalidOp: 99 },
      } as any);
    }).toThrow('Unsupported operator: $invalidOp');
  });

  it('should throw error if $eq operator is missing (simulate)', () => {
    // create a Qubo with no $eq in operators
    const qubo2 = createQubo<Product>(data, {
      operators: {
        // override eq to undefined
        $eq: undefined as any,
      },
    });
    expect(() => {
      qubo2.find({
        name: 'journal',
      });
    }).toThrow('Missing $eq operator definition.');
  });

  it('should handle custom operator', () => {
    const startsWith: OperatorFunction<Product> = (fieldValue, condValue) => {
      if (typeof fieldValue !== 'string' || typeof condValue !== 'string') return false;
      return fieldValue.startsWith(condValue);
    };

    const quboCustom = createQubo<Product>(data, {
      operators: {
        $startsWith: startsWith,
      },
    });

    const result = quboCustom.find({
      name: { $startsWith: 'p' },
    });
    // doc3 => 'paper', doc4 => 'planner', doc5 => 'postcard'
    const names = result.map((x) => x.name).sort();
    expect(names).toEqual(['paper', 'planner', 'postcard']);
  });

  // --------------------------------------------------
  // Array flatten / getNestedValue edge cases
  // --------------------------------------------------
  it('should handle getNestedValue when path is empty or doc is null', () => {
    // Testing empty path and null document cases
    const quboEmptyField = createQubo<Product>([
      { id: 999, name: 'empty', qty: 0, instock: null as any },
    ]);

    // "instock.qty": 5 => doc.instock is null => flatten => "undefined"
    const bools = quboEmptyField.evaluate({ 'instock.qty': 5 });
    expect(bools).toEqual([false]);
  });

  it('should handle array of arrays if it occurs', () => {
    // simulate doc with an array of arrays
    const multiDocument = {
      id: 101,
      name: 'multi-level',
      qty: 5,
      instock: [
        [{ warehouse: 'X', qty: 5 }, { warehouse: 'Y', qty: 10 }],
        [{ warehouse: 'Z', qty: 5 }],
      ],
    };
    const quboMulti = createQubo<Product>([multiDocument] as unknown as Product[]);
    // "instock.qty" => after first step => arrayOf array => [ [5,10], [5] ]
    //  flatten again => [[5,10],[5]] => array of arrays => "5" found => eq => true
    const bools = quboMulti.evaluate({ 'instock.qty': 5 });
    expect(bools).toEqual([true]);
  });

  it('should handle empty path in getNestedValue', () => {
    // Testing empty path case
    // getNestedValue(doc, "") => if (!path) return obj
    const bools = qubo.evaluate({ '': 5 } as any);
    expect(bools).toEqual([false, false, false, false, false]);
  });

  it('should return undefined if trying to getNestedValue from a primitive', () => {
    const qb = createQubo([
      { id: 301, foo: 'abc' },
    ] as any);
    const bools = qb.evaluate({
      'foo.bar': { $eq: 'xyz' },
    });
    // path => "foo.bar" => "foo" => "abc" => primitive => next step => undefined => eq => false
    expect(bools).toEqual([false]);
  });

  it('should handle $and with invalid subQuery (null) to cover typeof q !== \'object\'', () => {
    const data = [
      { id: 500, name: 'test' },
    ];
    const qb = createQubo(data);

    // $and => [ null, { name: "test" } ]
    // 'null' => typeof null => 'object', ama q === null => return false
    const result = qb.find({
      $and: [null, { name: 'test' }] as any,
    });
    // => every(...) => first subQuery is null => return false => entire => false => doc => not matched
    expect(result).toHaveLength(0);
  });

  it('should cover the $or break path (doc matched successfully)', () => {
    const data = [
      { id: 111, color: 'red', size: 3 },
      { id: 222, color: 'blue', size: 6 },
    ];
    const qb = createQubo(data);

    // $or => true for "size=6"
    const result = qb.find({
      $or: [
        { size: 6 },
        { color: 'green' },
      ],
    });
    // doc1 => size=3 => or => matched => handleOr => true => break => coverage
    // => returns doc1
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(222);
  });
});
