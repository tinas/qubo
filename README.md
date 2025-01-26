# Qubo

[![npm version](https://img.shields.io/npm/v/qubo.svg)](https://www.npmjs.com/package/qubo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/tinas/qubo/branch/main/graph/badge.svg)](https://codecov.io/gh/tinas/qubo)
[![CI](https://github.com/tinas/qubo/actions/workflows/ci.yml/badge.svg)](https://github.com/tinas/qubo/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Qubo is a lightweight TypeScript library that provides MongoDB-like query capabilities for in-memory JavaScript/TypeScript arrays. It allows you to write expressive queries using familiar MongoDB syntax.

## Features

- 🔍 MongoDB-like query syntax
- 💪 Fully typed with TypeScript
- 🎯 Built-in comparison, logical, and array operators
- 🔧 Extensible with custom operators
- 🛡️ Comprehensive error handling
- 📝 Well-documented with JSDoc

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
    item: 'journal',
    instock: [
      { warehouse: 'A', qty: 5 },
      { warehouse: 'C', qty: 15 }
    ]
  },
  {
    item: 'notebook',
    instock: [{ warehouse: 'C', qty: 5 }]
  }
];

const qubo = createQubo(data);

// Find items with qty between 10 and 20
const results = qubo.find({
  instock: { 
    $elemMatch: { 
      qty: { $gt: 10, $lte: 20 } 
    } 
  }
});

// Find first matching item
const oneResult = qubo.findOne({
  instock: { 
    $elemMatch: { 
      warehouse: 'A' 
    } 
  }
});

// Check if any item matches
const exists = qubo.evaluate({
  instock: { 
    $elemMatch: { 
      qty: { $lt: 10 } 
    } 
  }
});
```

## Built-in Operators

### Comparison Operators
- `$eq`: Equal to
- `$neq`: Not equal to
- `$gt`: Greater than
- `$gte`: Greater than or equal to
- `$lt`: Less than
- `$lte`: Less than or equal to
- `$regex`: Regular expression match

### Logical Operators
- `$and`: Logical AND
- `$or`: Logical OR
- `$not`: Logical NOT
- `$nor`: Logical NOR

### Array Operators
- `$elemMatch`: Match array elements
- `$in`: Match any value in array
- `$nin`: Not match any value in array

## Custom Operators

You can extend Qubo's functionality by adding your own custom operators:

```typescript
import { createQubo, type Operator } from 'qubo';

const $range: Operator = {
  name: '$range',
  fn: (value: unknown, range: [number, number]) => {
    if (typeof value === 'number' && Array.isArray(range) && range.length === 2) {
      const [min, max] = range;
      return value >= min && value <= max;
    }
    return false;
  }
};

const qubo = createQubo(data, {
  operators: [$range]
});

// Use custom operator
const results = qubo.find({
  age: { $range: [25, 35] }
});
```

## Error Handling

Qubo provides clear error messages prefixed with `[qubo]` for easy identification:

```typescript
try {
  const qubo = createQubo(data);
  qubo.find({
    age: { $unknown: 25 } // Unknown operator
  });
} catch (error) {
  console.error(error.message); // [qubo] Unknown operator: $unknown
}
```

## API Reference

### `createQubo<T>(data: T[], options?: QuboOptions): Qubo<T>`

Creates a new Qubo instance for querying an array of documents.

#### Parameters
- `data`: Array of documents to query
- `options`: Configuration options
  - `operators`: Array of custom operators

#### Returns
A Qubo instance with the following methods:
- `find(query: Query): T[]`: Find all matching documents
- `findOne(query: Query): T | null`: Find first matching document
- `evaluate(query: Query): boolean`: Check if any document matches

## License

MIT