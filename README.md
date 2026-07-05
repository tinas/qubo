# Qubo

[![npm version](https://img.shields.io/npm/v/qubo.svg)](https://www.npmjs.com/package/qubo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Qubo is a lightweight TypeScript library that provides MongoDB-like query capabilities for in-memory JavaScript/TypeScript objects and arrays. It ships a stateless query engine: create it once, evaluate any document or collection against expressive queries.

## Features

- 🎯 MongoDB-like query syntax with TypeScript support
- 🚀 Stateless engine — one instance evaluates any document or collection
- 💪 Rich set of comparison, logical, array and element operators
- 🎨 Truly extensible: custom operators can recurse into sub-queries, exactly like the built-ins
- 🔍 Deep object and array querying with dot notation
- 📦 Zero dependencies

## Installation

```bash
npm install qubo
# or
yarn add qubo
# or
pnpm add qubo
```

## Basic Usage

```typescript
import { createQubo } from 'qubo'

const qubo = createQubo()

const users = [
  {
    name: 'John',
    age: 30,
    scores: [85, 90, 95],
    address: { city: 'New York', zip: '10001' },
  },
  {
    name: 'Jane',
    age: 25,
    scores: [95, 85, 80],
    address: { city: 'Boston', zip: '02108' },
  },
]

// Test a single document — the primary use case
qubo.evaluate(users[0], { age: { $gte: 25 } }) // true

// Bind a query once, reuse the predicate
const isAdult = qubo.compile({ age: { $gte: 18 } })
users.filter(isAdult)

// Query collections
qubo.find(users, { age: { $gt: 25 } })
qubo.findOne(users, {
  $or: [{ 'address.city': 'Boston' }, { 'address.city': 'New York' }],
})
qubo.find(users, { scores: { $elemMatch: { $gte: 90 } } })
```

## Available Operators

### Comparison Operators

| Operator | Description                                                      | Example                             |
| -------- | ---------------------------------------------------------------- | ----------------------------------- |
| `$eq`    | Structural equality (objects, arrays and dates compare by value) | `{ age: { $eq: 25 } }`              |
| `$ne`    | Negated `$eq`                                                    | `{ status: { $ne: 'inactive' } }`   |
| `$gt`    | Greater than (numbers, strings, bigints, dates)                  | `{ price: { $gt: 100 } }`           |
| `$gte`   | Greater than or equal                                            | `{ rating: { $gte: 4 } }`           |
| `$lt`    | Less than                                                        | `{ stock: { $lt: 20 } }`            |
| `$lte`   | Less than or equal                                               | `{ priority: { $lte: 3 } }`         |
| `$in`    | Matches any value in the given array                             | `{ category: { $in: ['A', 'B'] } }` |
| `$nin`   | Matches none of the values in the given array                    | `{ tag: { $nin: ['draft'] } }`      |

When the field value is an array, comparison operators match if **any element** satisfies the condition, and `$eq` additionally matches the array as a whole.

### Logical Operators

| Operator | Description                                | Example                                                     |
| -------- | ------------------------------------------ | ----------------------------------------------------------- |
| `$and`   | All sub-queries must match                 | `{ $and: [{ price: { $gt: 10 } }, { stock: { $gt: 0 } }] }` |
| `$or`    | At least one sub-query must match          | `{ $or: [{ status: 'active' }, { priority: 1 }] }`          |
| `$nor`   | No sub-query may match                     | `{ $nor: [{ status: 'archived' }, { hidden: true }] }`      |
| `$not`   | Negates a sub-query or operator expression | `{ age: { $not: { $gt: 65 } } }`                            |

### Array and Element Operators

| Operator     | Description                                   | Example                                    |
| ------------ | --------------------------------------------- | ------------------------------------------ |
| `$elemMatch` | An array element matches all given conditions | `{ scores: { $elemMatch: { $gte: 90 } } }` |
| `$size`      | Array has exactly the given length            | `{ tags: { $size: 2 } }`                   |
| `$exists`    | Field is (or is not) present                  | `{ deletedAt: { $exists: false } }`        |

## Deep Object Querying

Use dot notation for nested fields. Intermediate arrays fan out automatically, so a path like `inventory.qty` over an array of objects resolves to all quantities:

```typescript
qubo.find(products, {
  'specs.cpu.cores': { $gte: 8 },
  'inventory.qty': { $gt: 0 },
})
```

## Custom Operators

Every operator — built-in or custom — has the same signature and receives a `context` that exposes the engine itself. This means custom operators can resolve paths, read the root document and recurse into sub-queries, exactly like `$elemMatch` or `$not` do:

```typescript
import { createQubo, type OperatorFn, type Query } from 'qubo'

// A simple value-level operator
const $between: OperatorFn = (value, operand) => {
  if (!Array.isArray(operand)) return false
  const [min, max] = operand as [number, number]
  return typeof value === 'number' && value >= min && value <= max
}

// An operator that recurses into a sub-query via the context
const $none: OperatorFn = (value, operand, context) =>
  Array.isArray(value) && !value.some(element => context.match(element, operand as Query))

// An operator that compares two fields of the same document via context.root
const $ltField: OperatorFn = (value, operand, context) => {
  const other = context.resolve(context.root, String(operand))
  return typeof value === 'number' && typeof other === 'number' && value < other
}

const qubo = createQubo({
  operators: { $between, $none, $ltField },
})

qubo.find(products, { price: { $between: [100, 200] } })
qubo.find(products, { inventory: { $none: { qty: { $lt: 1 } } } })
qubo.find(products, { sold: { $ltField: 'stock' } })
```

Operator names must start with `$`. Overriding a built-in operator (e.g. `$eq`) is allowed and also changes the implicit equality used by `{ field: value }` shorthands.

## Error Handling

Malformed queries throw a `QuboError` (message prefixed with `[qubo]`):

```typescript
import { QuboError } from 'qubo'

try {
  qubo.evaluate(document, { qty: { $unknownOp: 1 } })
} catch (error) {
  if (error instanceof QuboError) {
    // '[qubo] Unsupported operator: $unknownOp'
  }
}
```

## API Reference

### `createQubo(options?: QuboOptions): Qubo`

Creates a stateless query engine.

- `options.operators` — record of custom operators (names must start with `$`)

### `Qubo`

- `evaluate(document: unknown, query: Query): boolean` — tests a single document against a query
- `compile(query: Query): (document: unknown) => boolean` — binds a query once and returns a reusable predicate
- `find<T>(data: readonly T[], query: Query): T[]` — returns all matching documents
- `findOne<T>(data: readonly T[], query: Query): T | undefined` — returns the first matching document

### `OperatorFn`

```typescript
type OperatorFn = (value: unknown, operand: unknown, context: OperatorContext) => boolean

interface OperatorContext {
  root: unknown // the root document being evaluated
  match: (value: unknown, query: Query) => boolean // evaluate a sub-query
  resolve: (value: unknown, path: string) => unknown // resolve a dot-notation path
}
```

## License

MIT © Ahmet Tinastepe
