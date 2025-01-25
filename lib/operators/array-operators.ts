import { ArrayLengthOperator } from './array/array-length.operator';
import { ArrayContainsAllOperator } from './array/contains-all.operator';
import { ArrayContainsAnyOperator } from './array/contains-any.operator';
import { ArrayContainsOperator } from './array/contains.operator';
import { ArrayEmptyOperator } from './array/empty.operator';

export const arrayOperators = {
  $length: ArrayLengthOperator,
  $contains: ArrayContainsOperator,
  $containsAll: ArrayContainsAllOperator,
  $containsAny: ArrayContainsAnyOperator,
  $empty: ArrayEmptyOperator,
};
