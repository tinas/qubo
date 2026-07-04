import { describe, expect, test } from 'vite-plus/test'

import { createQubo, QuboError } from '../src/index'
import type { OperatorFn, Query } from '../src/index'

interface Product {
  id: number
  name: string
  qty: number
  instock?: Array<{ warehouse: string; qty: number }>
  tags?: string[]
}

const products: Product[] = [
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
]

const qubo = createQubo()

describe('find and findOne', () => {
  test('matches primitive equality', () => {
    const result = qubo.find(products, { qty: 5 })
    expect(result.map(product => product.name)).toEqual(['journal'])
  })

  test('matches nested paths through arrays', () => {
    const result = qubo.findOne(products, { 'instock.qty': 15 })
    expect(result?.id).toBe(1)
  })

  test('returns undefined when nothing matches', () => {
    expect(qubo.findOne(products, { qty: 999 })).toBeUndefined()
  })
})

describe('comparison operators', () => {
  test('combines $gt and $lte on the same field', () => {
    const result = qubo.find(products, { qty: { $gt: 10, $lte: 40 } })
    expect(result.map(product => product.id).sort((a, b) => a - b)).toEqual([4, 5])
  })

  test('$ne on array fields means "does not contain"', () => {
    const result = qubo.find(products, { tags: { $ne: 'paper' } })
    expect(result.map(product => product.name).sort((a, b) => a.localeCompare(b))).toEqual([
      'paper',
      'planner',
      'postcard',
    ])
  })

  test('$gt ignores values that are not comparable to the operand', () => {
    expect(qubo.find(products, { qty: { $gt: 'not-a-number' } })).toHaveLength(0)
  })

  test('$gt compares strings', () => {
    const result = qubo.find(products, { name: { $gt: 'paper' } })
    expect(result.map(product => product.name).sort((a, b) => a.localeCompare(b))).toEqual([
      'planner',
      'postcard',
    ])
  })

  test('$gte and $lt compare dates', () => {
    const events = [
      { id: 1, at: new Date('2026-01-01') },
      { id: 2, at: new Date('2026-06-01') },
    ]
    expect(
      qubo.find(events, { at: { $gte: new Date('2026-03-01') } }).map(event => event.id),
    ).toEqual([2])
    expect(
      qubo.find(events, { at: { $lt: new Date('2026-03-01') } }).map(event => event.id),
    ).toEqual([1])
  })

  test('array fields match when any comparable element satisfies the order', () => {
    const data = [{ id: 999, values: ['a', 10, true] }]
    expect(qubo.find(data, { values: { $gt: 5 } })).toHaveLength(1)
    expect(qubo.find(data, { values: { $gt: 50 } })).toHaveLength(0)
  })

  test('$in and $nin match primitives and array elements', () => {
    expect(
      qubo
        .find(products, { qty: { $in: [10, 60] } })
        .map(product => product.id)
        .sort((a, b) => a - b),
    ).toEqual([2, 3])
    expect(
      qubo
        .find(products, { tags: { $nin: ['stationery', 'paper'] } })
        .map(product => product.id)
        .sort((a, b) => a - b),
    ).toEqual([4, 5])
  })

  test('$in and $nin do not match when the operand is not an array', () => {
    expect(qubo.find(products, { qty: { $in: 10 } })).toHaveLength(0)
    expect(qubo.find(products, { qty: { $nin: 10 } })).toHaveLength(0)
  })

  test('$eq compares objects and arrays structurally', () => {
    const data = [
      { id: 1, address: { city: 'Boston', zip: '02108' }, tags: ['a', 'b'] },
      { id: 2, address: { city: 'Boston', zip: '10001' }, tags: ['b'] },
    ]
    expect(
      qubo.find(data, { address: { $eq: { city: 'Boston', zip: '02108' } } }).map(item => item.id),
    ).toEqual([1])
    expect(qubo.find(data, { tags: { $eq: ['a', 'b'] } }).map(item => item.id)).toEqual([1])
  })
})

describe('logical operators', () => {
  test('$and requires every sub-query to match', () => {
    const result = qubo.find(products, {
      $and: [{ 'instock.qty': { $gte: 15 } }, { 'instock.warehouse': 'C' }],
    })
    expect(result.map(product => product.id).sort((a, b) => a - b)).toEqual([1, 5])
  })

  test('$or requires at least one sub-query to match', () => {
    const result = qubo.find(products, {
      $or: [{ name: 'journal' }, { qty: { $lt: 10 } }],
    })
    expect(result.map(product => product.id)).toEqual([1])
  })

  test('$and and $or throw when the operand is not an array', () => {
    expect(() => qubo.find(products, { $and: { invalid: 'object' } })).toThrow(
      '$and expects an array of queries.',
    )
    expect(() => qubo.find(products, { $or: { invalid: 'object' } })).toThrow(
      '$or expects an array of queries.',
    )
  })

  test('sub-queries that are not objects never match', () => {
    expect(qubo.find(products, { $and: [null, { qty: 5 }] })).toHaveLength(0)
    expect(qubo.find(products, { $or: [null, { qty: 5 }] }).map(product => product.id)).toEqual([1])
  })

  test('$not negates a sub-query', () => {
    const result = qubo.find(products, { qty: { $not: { $gt: 10 } } })
    expect(result.map(product => product.id).sort((a, b) => a - b)).toEqual([1, 2])
  })

  test('$not throws when the operand is not a query object', () => {
    expect(() => qubo.find(products, { qty: { $not: 5 } })).toThrow('$not expects a query object.')
  })

  test('$nor matches when no sub-query matches', () => {
    const result = qubo.find(products, {
      $nor: [{ qty: { $gt: 10 } }, { name: 'journal' }],
    })
    expect(result.map(product => product.id)).toEqual([2])
  })
})

describe('array and element operators', () => {
  test('$elemMatch matches array elements against a sub-query', () => {
    const result = qubo.find(products, {
      instock: { $elemMatch: { warehouse: 'C', qty: { $lt: 10 } } },
    })
    expect(result.map(product => product.name)).toEqual(['notebook'])
  })

  test('$elemMatch supports bare operator expressions', () => {
    const data = [
      { id: 1, scores: [85, 90, 95] },
      { id: 2, scores: [60, 70] },
    ]
    expect(qubo.find(data, { scores: { $elemMatch: { $gte: 90 } } }).map(item => item.id)).toEqual([
      1,
    ])
  })

  test('$elemMatch does not match non-array values', () => {
    expect(
      qubo.find([{ id: 201, instock: 'not-an-array' }], { instock: { $elemMatch: { qty: 5 } } }),
    ).toHaveLength(0)
  })

  test('$elemMatch throws when the operand is not a query object', () => {
    expect(() => qubo.find(products, { instock: { $elemMatch: 5 } })).toThrow(
      '$elemMatch expects a query object.',
    )
  })

  test('$size matches array length', () => {
    expect(qubo.find(products, { instock: { $size: 1 } }).map(product => product.id)).toEqual([2])
    expect(qubo.find(products, { instock: { $size: 'nope' } })).toHaveLength(0)
  })

  test('$exists checks field presence', () => {
    expect(qubo.find(products, { tags: { $exists: false } }).map(product => product.id)).toEqual([
      5,
    ])
    expect(qubo.find(products, { tags: { $exists: true } })).toHaveLength(4)
  })
})

describe('path resolution', () => {
  test('null values along the path never match', () => {
    const data = [{ id: 999, name: 'empty', qty: 0, instock: null }]
    expect(qubo.find(data, { 'instock.qty': 5 })).toHaveLength(0)
  })

  test('null leaf values match null', () => {
    const data = [
      { id: 1, owner: null },
      { id: 2, owner: 'me' },
    ]
    expect(qubo.find(data, { owner: null }).map(item => item.id)).toEqual([1])
  })

  test('flattens nested arrays', () => {
    const data = [
      {
        id: 101,
        instock: [
          [
            { warehouse: 'X', qty: 5 },
            { warehouse: 'Y', qty: 10 },
          ],
          [{ warehouse: 'Z', qty: 5 }],
        ],
      },
    ]
    expect(qubo.find(data, { 'instock.qty': 5 })).toHaveLength(1)
  })

  test('empty path resolves to the document itself', () => {
    expect(qubo.find(products, { '': 5 })).toHaveLength(0)
  })

  test('paths through primitives resolve to undefined', () => {
    expect(qubo.find([{ id: 301, foo: 'abc' }], { 'foo.bar': { $eq: 'xyz' } })).toHaveLength(0)
  })
})

describe('evaluate and compile', () => {
  test('evaluate tests a single document', () => {
    expect(qubo.evaluate(products[1], { qty: 10 })).toBe(true)
    expect(qubo.evaluate(products[1], { qty: 999 })).toBe(false)
  })

  test('compile returns a reusable predicate', () => {
    const hasQtyFive = qubo.compile({ 'instock.qty': 5 })
    expect(products.map(product => hasQtyFive(product))).toEqual([true, true, false, true, false])
  })

  test('throws when the query is not a plain object', () => {
    expect(() => qubo.evaluate(products[0], null as unknown as Query)).toThrow(
      'Query must be a plain object.',
    )
  })
})

describe('errors', () => {
  test('throws QuboError for unsupported field operators', () => {
    expect(() => qubo.find(products, { qty: { $invalidOp: 99 } })).toThrow(QuboError)
    expect(() => qubo.find(products, { qty: { $invalidOp: 99 } })).toThrow(
      'Unsupported operator: $invalidOp',
    )
  })

  test('throws for unsupported root operators', () => {
    expect(() => qubo.find(products, { $unsupported: [] })).toThrow(
      'Unsupported operator: $unsupported',
    )
  })

  test('treats non-operator keys inside operator expressions as unsupported', () => {
    expect(() => qubo.find(products, { qty: { warehouse: 'A' } })).toThrow(
      'Unsupported operator: warehouse',
    )
  })
})

describe('custom operators', () => {
  test('adds field-level operators', () => {
    const $startsWith: OperatorFn = (value, operand) =>
      typeof value === 'string' && typeof operand === 'string' && value.startsWith(operand)

    const custom = createQubo({ operators: { $startsWith } })
    const result = custom.find(products, { name: { $startsWith: 'p' } })
    expect(result.map(product => product.name).sort((a, b) => a.localeCompare(b))).toEqual([
      'paper',
      'planner',
      'postcard',
    ])
  })

  test('operators can recurse into sub-queries via the context', () => {
    const $none: OperatorFn = (value, operand, context) =>
      Array.isArray(value) && !value.some(element => context.match(element, operand as Query))

    const custom = createQubo({ operators: { $none } })
    const result = custom.find(products, { instock: { $none: { qty: { $lt: 10 } } } })
    expect(result.map(product => product.id).sort((a, b) => a - b)).toEqual([3, 5])
  })

  test('operators can read the root document via the context', () => {
    const $lteField: OperatorFn = (value, operand, context) => {
      const other = context.resolve(context.root, String(operand))
      const order =
        typeof value === 'number' && typeof other === 'number' ? value - other : undefined
      return order !== undefined && order <= 0
    }

    const custom = createQubo({ operators: { $lteField } })
    const data = [
      { id: 1, sold: 3, qty: 5 },
      { id: 2, sold: 9, qty: 5 },
    ]
    expect(custom.find(data, { sold: { $lteField: 'qty' } }).map(item => item.id)).toEqual([1])
  })

  test('overriding $eq also changes implicit equality', () => {
    const $eq: OperatorFn = (value, operand) =>
      typeof value === 'string' && typeof operand === 'string'
        ? value.toLowerCase() === operand.toLowerCase()
        : value === operand

    const custom = createQubo({ operators: { $eq } })
    expect(custom.find(products, { name: 'JOURNAL' }).map(product => product.id)).toEqual([1])
  })

  test('rejects operator names without the $ prefix', () => {
    const startsWith: OperatorFn = () => true
    expect(() => createQubo({ operators: { startsWith } } as never)).toThrow(
      'Operator names must start with "$": startsWith',
    )
  })

  test('rejects operators that are not functions', () => {
    expect(() => createQubo({ operators: { $eq: undefined } } as never)).toThrow(
      'Operator $eq must be a function.',
    )
  })
})
