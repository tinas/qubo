import type { IOperator } from '../../operator.types';
import { ArrayLengthOperator } from './array-length.operator';
import { ArrayContainsOperator } from './contains.operator';
import { ArrayContainsAllOperator } from './contains-all.operator';
import { ArrayContainsAnyOperator } from './contains-any.operator';
import { ArrayEmptyOperator } from './empty.operator';

export const arrayOperators = new Map<string, IOperator>([
  ['$length', new ArrayLengthOperator()],
  ['$contains', new ArrayContainsOperator()],
  ['$containsAll', new ArrayContainsAllOperator()],
  ['$containsAny', new ArrayContainsAnyOperator()],
  ['$empty', new ArrayEmptyOperator()],
]);

export * from './array-length.operator';
export * from './contains.operator';
export * from './contains-all.operator';
export * from './contains-any.operator';
export * from './empty.operator'; 