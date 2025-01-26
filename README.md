# Qubo

[![npm version](https://img.shields.io/npm/v/qubo.svg)](https://www.npmjs.com/package/qubo)
[![License](https://img.shields.io/npm/l/qubo.svg)](https://github.com/tinas/qubo/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/tinas/qubo/graph/badge.svg)](https://codecov.io/gh/tinas/qubo)

A lightweight, zero-dependency MongoDB-like query builder for JavaScript/TypeScript objects.

## Features

- MongoDB-like query syntax
- Fully typed with TypeScript
- Zero dependencies
- Supports nested objects and arrays
- Custom operator registration
- Intuitive API with `find`, `findOne`, and `evaluate` functions
- 100% test coverage

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Supported Operators](#supported-operators)
  - [Custom Operators](#custom-operators)
  - [Type Safety](#type-safety)
- [API Reference](#api-reference)

## Installation

```bash
npm install qubo
# or
yarn add qubo
# or
pnpm add qubo
```

## Usage

### Basic Usage

```typescript
import { createQubo } from 'qubo';

const users = [
  { id: 1, name: 'John', age: 25, scores: [85, 90, 95] },
  { id: 2, name: 'Jane', age: 30, scores: [95, 95, 98] },
  { id: 3, name: 'Bob', age: 20, scores: [75, 80, 85] },
];

const qubo = createQubo(users);

// Find all users age 25 or older
const adults = qubo.find({ age: { $gte: 25 } });

// Find first user with a score of 95
const highScorer = qubo.findOne({ scores: { $all: [95] } });

// Evaluate if a document matches a query
const isAdult = qubo.evaluate({ age: 28 }, { age: { $gte: 25 } });
```

### Supported Operators

#### Comparison Operators
- `$eq`: Equals
- `$gt`: Greater than
- `$gte`: Greater than or equal
- `$lt`: Less than
- `$lte`: Less than or equal
- `$ne`: Not equal
- `$in`: In array
- `$nin`: Not in array

#### Logical Operators
- `$and`: Logical AND
- `$or`: Logical OR
- `$not`: Logical NOT
- `$nor`: Logical NOR

#### Array Operators
- `$all`: All elements match
- `$elemMatch`: Element matches condition
- `$size`: Array size equals

#### Element Operators
- `$exists`: Field exists
- `$type`: Field is of type

### Custom Operators

You can register custom operators to extend Qubo's functionality:

```typescript
const qubo = createQubo(users, {
  operators: {
    $between: (value, [min, max]) => value >= min && value <= max,
  }
});

// Find users with age between 25 and 30
const result = qubo.find({ age: { $between: [25, 30] } });
```

### Type Safety

Qubo is fully typed with TypeScript:

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  scores: number[];
}

const qubo = createQubo<User>(users);

// TypeScript will provide type checking and autocompletion
const result = qubo.find({
  name: { $eq: 'John' },
  age: { $gte: 25 },
  scores: { $all: [95] }
});
```

## API Reference

### `createQubo<T>(source: T[], options?: QuboOptions)`

Creates a new Qubo instance.

#### Parameters
- `source`: Array of documents to query
- `options`: Configuration options
  - `operators`: Custom operators to register

#### Returns
Object with the following methods:

##### `find(query: Query<T>): T[]`
Finds all documents matching the query.

##### `findOne(query: Query<T>): T | null`
Finds the first document matching the query.

##### `evaluate(doc: T, query: Query<T>): boolean`
Evaluates if a document matches the query.

## License

[MIT](LICENSE)