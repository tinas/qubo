# Qubo

[![npm version](https://img.shields.io/npm/v/qubo.svg)](https://www.npmjs.com/package/qubo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/tinas/qubo/branch/main/graph/badge.svg)](https://codecov.io/gh/tinas/qubo)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Qubo is a lightweight TypeScript library that provides MongoDB-like query capabilities for in-memory JavaScript/TypeScript arrays. It allows you to write expressive queries using a familiar syntax while maintaining type safety.

## Features

- 🎯 MongoDB-like query syntax with TypeScript support
- 🚀 High-performance in-memory querying
- 💪 Rich set of comparison, logical, and array operators
- 🎨 Extensible with custom operators
- 📝 Well-documented API with TypeScript types
- 🔍 Deep object and array querying capabilities

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
import { createQubo } from 'qubo';

const data = [
  { 
    name: 'John',
    age: 30,
    scores: [85, 90, 95],
    address: {
      city: 'New York',
      zip: '10001'
    }
  },
  { 
    name: 'Jane',
    age: 25,
    scores: [95, 85, 80],
    address: {
      city: 'Boston',
      zip: '02108'
    }
  }
];

const qubo = createQubo(data);

// Find all documents where age is greater than 25
const results = qubo.find({ age: { $gt: 25 } });

// Using logical operators
const bostonOrNewYork = qubo.find({
  $or: [
    { 'address.city': 'Boston' },
    { 'address.city': 'New York' }
  ]
});

// Using array operators
const highScores = qubo.find({
  scores: { $elemMatch: { $gte: 90 } }
});

// Evaluate a single document
const matches = qubo.evaluateOne(
  { name: 'Alice', age: 28 }, 
  { age: { $gte: 25 } }
);
```

## Available Operators

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Matches values equal to specified value | `{ age: { $eq: 25 } }` |
| `$ne` | Matches values not equal to specified value | `{ status: { $ne: 'inactive' } }` |
| `$gt` | Matches values greater than specified value | `{ price: { $gt: 100 } }` |
| `$gte` | Matches values greater than or equal to specified value | `{ rating: { $gte: 4 } }` |
| `$lt` | Matches values less than specified value | `{ stock: { $lt: 20 } }` |
| `$lte` | Matches values less than or equal to specified value | `{ priority: { $lte: 3 } }` |
| `$in` | Matches any value in the specified array | `{ category: { $in: ['A', 'B'] } }` |
| `$nin` | Matches none of the values in the specified array | `{ tag: { $nin: ['draft', 'deleted'] } }` |

### Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$and` | Matches all specified conditions | `{ $and: [{ price: { $gt: 10 } }, { stock: { $gt: 0 } }] }` |
| `$or` | Matches at least one condition | `{ $or: [{ status: 'active' }, { priority: 1 }] }` |

### Array Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$elemMatch` | Matches documents that contain an array element matching all specified conditions | `{ scores: { $elemMatch: { $gte: 90 } } }` |

## Deep Object Querying

Qubo supports querying nested objects using dot notation:

```typescript
const data = [
  {
    item: 'laptop',
    specs: {
      cpu: {
        cores: 8,
        speed: 2.4
      },
      memory: {
        size: 16,
        type: 'DDR4'
      }
    }
  }
];

const qubo = createQubo(data);

// Query nested fields
const results = qubo.find({
  'specs.cpu.cores': { $gte: 8 },
  'specs.memory.type': 'DDR4'
});
```

## Array Handling

Qubo provides powerful array querying capabilities:

```typescript
const data = [
  {
    product: 'Gaming Laptop',
    inventory: [
      { store: 'Main', quantity: 5, price: 1200 },
      { store: 'Branch', quantity: 3, price: 1250 }
    ],
    tags: ['electronics', 'gaming']
  }
];

const qubo = createQubo(data);

// Find products with specific inventory conditions
const results = qubo.find({
  inventory: {
    $elemMatch: {
      store: 'Main',
      quantity: { $gt: 0 },
      price: { $lt: 1500 }
    }
  }
});

// Find products with specific tags
const gaming = qubo.find({
  tags: { $in: ['gaming'] }
});
```

## Custom Operators

You can extend Qubo's functionality by adding your own operators:

```typescript
import { createQubo, type OperatorFunction } from 'qubo';

// Custom operator that checks if a number is within a range
const $between: OperatorFunction<any> = (fieldValue, [min, max]) => {
  if (typeof fieldValue !== 'number') return false;
  return fieldValue >= min && fieldValue <= max;
};

// Custom operator for string pattern matching
const $startsWith: OperatorFunction<any> = (fieldValue, prefix) => {
  if (typeof fieldValue !== 'string' || typeof prefix !== 'string') return false;
  return fieldValue.startsWith(prefix);
};

const qubo = createQubo(data, {
  operators: {
    $between,
    $startsWith
  }
});

// Use custom operators
const results = qubo.find({
  price: { $between: [100, 200] },
  name: { $startsWith: 'i' }
});
```

## API Reference

### `createQubo<T>(dataSource: T[], options?: QuboOptions<T>)`

Creates a new Qubo instance for querying documents.

#### Parameters
- `dataSource`: Array of documents to query
- `options`: Optional configuration
  - `operators`: Record of custom operators

#### Returns
Object with the following methods:

- `find(query: Record<string, unknown>): T[]`
  - Finds all documents matching the query
  
- `findOne(query: Record<string, unknown>): T | undefined`
  - Finds first document matching the query
  
- `evaluate(query: Record<string, unknown>): boolean[]`
  - Returns array of boolean values indicating which documents match
  
- `evaluateOne(document: T, query: Record<string, unknown>): boolean`
  - Evaluates a single document against the query

## License

MIT License

Copyright (c) 2025 Ahmet Tinastepe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.