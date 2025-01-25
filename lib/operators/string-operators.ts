import { ContainsOperator } from './string/contains.operator';
import { EndsWithOperator } from './string/ends-with.operator';
import { StringLengthOperator } from './string/length.operator';
import { RegexOperator } from './string/regex.operator';
import { StartsWithOperator } from './string/starts-with.operator';

export const stringOperators = {
  $contains: ContainsOperator,
  $endsWith: EndsWithOperator,
  $length: StringLengthOperator,
  $regex: RegexOperator,
  $startsWith: StartsWithOperator,
};
