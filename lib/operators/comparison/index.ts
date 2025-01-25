import type { IOperator } from '../../operator.types';
import { EqualOperator } from './equal.operator';
import { GreaterThanOperator } from './greater-than.operator';
import { GreaterThanEqualOperator } from './greater-than-equal.operator';
import { LessThanOperator } from './less-than.operator';
import { LessThanEqualOperator } from './less-than-equal.operator';
import { NotEqualOperator } from './not-equal.operator';
import { InOperator } from './in.operator';
import { NotInOperator } from './not-in.operator';
// ... import other operators

// Default operator map
export const comparisonOperators = new Map<string, IOperator>([
  ['$eq', new EqualOperator()],
  ['$gt', new GreaterThanOperator()],
  ['$gte', new GreaterThanEqualOperator()],
  ['$lt', new LessThanOperator()],
  ['$lte', new LessThanEqualOperator()],
  ['$ne', new NotEqualOperator()],
  ['$in', new InOperator()],
  ['$nin', new NotInOperator()],
  // ... add other operators
]);

export * from './equal.operator';
export * from './greater-than.operator';
export * from './greater-than-equal.operator';
export * from './less-than.operator';
export * from './less-than-equal.operator';
export * from './not-equal.operator';
export * from './in.operator';
export * from './not-in.operator'; 