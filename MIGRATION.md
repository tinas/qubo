# Migrating from 0.2.x to 0.3.0

0.3.0 rebuilds qubo as a stateless engine with a unified operator model. Query syntax and matching semantics are preserved unless listed below.

## The instance is no longer bound to a data array

`createQubo` now only takes options; data is passed per call.

```typescript
// Before
const qubo = createQubo(data, { operators })
qubo.find({ qty: { $gt: 10 } })
qubo.findOne({ qty: { $gt: 10 } })
qubo.evaluateOne(document, { qty: { $gt: 10 } })
qubo.evaluate({ qty: { $gt: 10 } }) // boolean[]

// After
const qubo = createQubo({ operators })
qubo.find(data, { qty: { $gt: 10 } })
qubo.findOne(data, { qty: { $gt: 10 } })
qubo.evaluate(document, { qty: { $gt: 10 } })
data.map(qubo.compile({ qty: { $gt: 10 } })) // boolean[]
```

## Custom operator signature changed

`OperatorFunction<T>` is replaced by the non-generic `OperatorFn`. The third parameter is now an `OperatorContext` instead of the document; the root document is available as `context.root`.

```typescript
// Before
const $startsWith: OperatorFunction<Product> = (fieldValue, conditionValue, document) =>
  typeof fieldValue === 'string' && fieldValue.startsWith(String(conditionValue))

// After
const $startsWith: OperatorFn = (value, operand, context) =>
  typeof value === 'string' && value.startsWith(String(operand))
```

The context also exposes `match` (evaluate a sub-query) and `resolve` (resolve a dot-notation path), so operators like `$elemMatch` can now be written in userland.

## Errors are `QuboError`

All query errors throw `QuboError` (subclass of `Error`) instead of plain `Error`/`TypeError`. Messages keep the `[qubo]` prefix. Two messages changed:

- `Unsupported root operator: $x` → `Unsupported operator: $x`
- `Missing $eq operator definition.` → passing a non-function operator now fails at `createQubo` time with `Operator $eq must be a function.`

Operator names are validated at creation: names not starting with `$` throw immediately.

## `$eq` uses structural equality

`$eq` (and the `{ field: value }` shorthand) previously used `===`, so object, array and date operands could never match. They now compare by value:

```typescript
qubo.find(data, { address: { $eq: { city: 'Boston' } } }) // now matches
qubo.find(data, { tags: { $eq: ['a', 'b'] } }) // matches the whole array too
```

Array fields still match by membership as before; whole-array equality is checked in addition. If you relied on reference equality, replace it with a custom operator. `$in` and `$nin` compare candidates structurally as well.

Note that the `{ field: value }` shorthand with a `Date` (or any class instance) operand previously matched **every** document — the operand was mistaken for an empty operator object. It now compares by value, so result sets shrink to actual matches.

## `null` field values now match `null`

Path resolution previously collapsed `null` to `undefined`, so `{ a: null }` and `{ a: { $eq: null } }` never matched a document with `a: null`. They now match, and `{ a: { $ne: null } }` flips accordingly. Missing fields still do not match `null`.

## Comparison operators support more types

`$gt`, `$gte`, `$lt`, `$lte` previously only compared numbers and returned `false` for anything else. They now also compare strings, bigints and dates (both sides must be the same type). Queries such as `{ name: { $gt: 'paper' } }` that silently matched nothing before now return results.

## `$elemMatch` accepts bare operator expressions

`{ scores: { $elemMatch: { $gte: 90 } } }` previously threw `Unsupported root operator: $gte`; it now works as documented. A non-object operand (`{ $elemMatch: 5 }`) now throws instead of failing silently.

## New built-in operators

`$not`, `$nor`, `$exists` and `$size` are now built in. If you defined custom operators with these names, they will override the built-ins (existing behavior for you is unchanged).

## The package is ESM-only

0.2.x shipped a CommonJS build (`main: dist/index.cjs.js`); 0.3.0 ships only an ES module. `import` works everywhere; `require('qubo')` works on Node.js ≥ 20.19 (via `require(esm)`) but fails on older Node and CJS-only bundler setups.
