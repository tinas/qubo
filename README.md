# Qubo

[![npm version](https://img.shields.io/npm/v/qubo.svg)](https://www.npmjs.com/package/qubo)
[![License](https://img.shields.io/npm/l/qubo.svg)](https://github.com/tinas/qubo/blob/main/LICENSE)

MongoDB-style query builder for JavaScript/TypeScript objects with zero dependencies. Qubo allows you to write MongoDB-like queries to filter and evaluate objects in memory.

## Features

- 🚀 MongoDB-like query syntax
- 💪 Full TypeScript support
- 🎯 Zero dependencies
- 🔍 Rich set of operators
- 🧠 Smart caching for better performance
- 🔧 Extensible with custom operators
- 🔄 Modular design

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Filtering](#filtering)
  - [Evaluating](#evaluating)
- [Query Examples](#query-examples)
  - [Simple Queries](#simple-queries)
  - [Comparison Operators](#comparison-operators)
  - [Logical Operators](#logical-operators)
  - [Array Queries](#array-queries)
  - [Nested Object Queries](#nested-object-queries)
  - [Custom Operators](#custom-operators)
- [API Reference](#api-reference)
- [TypeScript Support](#typescript-support)

## Installation

```bash
npm install qubo
# or
yarn add qubo
# or
pnpm add qubo
```

## Basic Usage

### Filtering

```typescript
import { QueryExecutor } from 'qubo';

interface User {
  name: string;
  age: number;
  email: string;
  address: {
    city: string;
    country: string;
  };
  tags: string[];
  lastLoginDate?: Date;
}

const users: User[] = [
  {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    address: { city: "New York", country: "USA" },
    tags: ["premium", "active"],
    lastLoginDate: new Date('2024-01-01')
  }
];

const executor = new QueryExecutor<User>(users);

// Find all matching users
const results = executor.find({
  age: { $gte: 25 },
  "address.country": "USA"
});

// Find first matching user
const user = executor.findOne({
  tags: { $contains: "premium" }
});
```

### Evaluating

```typescript
import { QueryExecutor } from 'qubo';

interface Rule {
  minAge: number;
  countries: string[];
  requiredTags: string[];
}

// Example: Check if a user is eligible for premium features
const eligibilityRule: Rule = {
  minAge: 21,
  countries: ["USA", "UK", "EU"],
  requiredTags: ["active"]
};

const executor = new QueryExecutor<User>([]);

// Evaluate a single user against a rule
const isEligible = executor.evaluate(user, {
  $and: [
    { age: { $gte: eligibilityRule.minAge } },
    { "address.country": { $in: eligibilityRule.countries } },
    { tags: { $containsAll: eligibilityRule.requiredTags } }
  ]
});

// Evaluate multiple conditions
const canAccessFeature = executor.evaluate(user, {
  $or: [
    { tags: { $contains: "premium" } },
    {
      $and: [
        { age: { $gte: 18 } },
        { lastLoginDate: { $dateWithin: { days: 7 } } }
      ]
    }
  ]
});

// Use with custom operators
class AgeGroupOperator implements IOperator {
  evaluate(value: number, group: 'adult' | 'senior'): boolean {
    switch (group) {
      case 'adult': return value >= 18 && value < 65;
      case 'senior': return value >= 65;
      default: return false;
    }
  }
}

executor.addOperator('$ageGroup', new AgeGroupOperator());

const isAdult = executor.evaluate(user, {
  age: { $ageGroup: 'adult' }
});
```

## Query Examples

### Simple Queries

```typescript
// Equal match
executor.find({ name: 'John Doe' });

// Multiple conditions (implicit AND)
executor.find({ age: 30, "address.country": "USA" });

// Existence check
executor.find({ email: { $exists: false } });
```

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$eq` | Equal | `{ age: { $eq: 25 } }` |
| `$ne` | Not equal | `{ status: { $ne: 'inactive' } }` |
| `$gt` | Greater than | `{ age: { $gt: 18 } }` |
| `$gte` | Greater than or equal | `{ age: { $gte: 21 } }` |
| `$lt` | Less than | `{ price: { $lt: 100 } }` |
| `$lte` | Less than or equal | `{ stock: { $lte: 50 } }` |
| `$in` | In array | `{ role: { $in: ['admin', 'mod'] } }` |
| `$nin` | Not in array | `{ status: { $nin: ['banned'] } }` |
| `$regex` | Regular expression | `{ name: { $regex: '^J' } }` |
| `$exists` | Field exists | `{ email: { $exists: true } }` |

### Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `$and` | All conditions true | `{ $and: [{...}, {...}] }` |
| `$or` | Any condition true | `{ $or: [{...}, {...}] }` |
| `$not` | Negate condition | `{ $not: [{...}] }` |
| `$nor` | All conditions false | `{ $nor: [{...}, {...}] }` |

```typescript
// Complex example
executor.find({
  $or: [
    {
      $and: [
        { age: { $gte: 18 } },
        { age: { $lt: 25 } }
      ]
    },
    {
      $and: [
        { role: 'admin' },
        { "address.country": "USA" }
      ]
    }
  ]
});
```

### Array Queries

```typescript
interface User {
  name: string;
  scores: number[];
  tags: string[];
}

// Examples
executor.find({ 'scores.0': { $gte: 90 } }); // First score >= 90
executor.find({ tags: 'student' }); // Has 'student' tag
executor.find({ scores: { $size: 3 } }); // Has exactly 3 scores
```

### Nested Object Queries

```typescript
interface User {
  name: string;
  address: {
    city: string;
    country: string;
    location: {
      lat: number;
      lng: number;
    };
  };
}

// Examples
executor.find({ 'address.city': 'London' });
executor.find({ 'address.location.lat': { $gt: 50 } });
```

### Custom Operators

```typescript
import { QueryExecutor, IOperator } from 'qubo';

// Create custom operator
class HasWordCountOperator implements IOperator {
  evaluate(value: string, count: number): boolean {
    return typeof value === 'string' && 
           value.split(/\s+/).length === count;
  }
}

// Initialize executor with custom operator
const executor = new QueryExecutor<User>(users);
executor.addOperator('$hasWordCount', new HasWordCountOperator());

// Use custom operator
executor.find({
  name: { $hasWordCount: 2 } // Matches "John Doe"
});
```

## API Reference

### Main Functions

#### `find<T>(query: Query<T>, options?: QueryOptions): T[]`
- Filters an array based on the query
- Returns matching elements

#### `findOne<T>(query: Query<T>, options?: QueryOptions): T | null`
- Returns the first matching element or null

#### `evaluate<T>(item: T, query: Query<T>, options?: QueryOptions): boolean`
- Evaluates if an item matches the query
- Returns true if the item matches all conditions
- Useful for rule evaluation and validation

### Types

```typescript
interface QueryOptions {
  customComparisonOperators?: Record<string, CustomComparisonOperator<any>>;
  customLogicalOperators?: Record<string, CustomLogicalOperator<any>>;
}

type CustomComparisonOperator<T> = (value: T, compareValue: any) => boolean;
type CustomLogicalOperator<T> = (queries: Query<T>[], source: T) => boolean;
```

## TypeScript Support

```typescript
import { Query } from 'qubo';

interface User {
  id: number;
  name: string;
  age: number;
  email?: string;
  roles: string[];
  metadata: {
    lastLogin: Date;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  };
}

// Type-safe queries
const query1: Query<User> = {
  age: { $gt: 25 },
  roles: { $in: ['admin'] }
};

// TypeScript errors
const invalidQuery: Query<User> = {
  age: { $gt: 'invalid' }, // Type error: string not assignable to number
  unknownField: 123       // Type error: field does not exist
};
```

## License

[MIT](LICENSE)