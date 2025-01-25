import type { IOperator } from '../../operator.types';
import { ContainsOperator } from './contains.operator';
import { StartsWithOperator } from './starts-with.operator';
import { EndsWithOperator } from './ends-with.operator';
import { RegexOperator } from './regex.operator';
import { StringLengthOperator } from './length.operator';
// ... import other operators

export const stringOperators = new Map<string, IOperator>([
  ['$contains', new ContainsOperator()],
  ['$startsWith', new StartsWithOperator()],
  ['$endsWith', new EndsWithOperator()],
  ['$regex', new RegexOperator()],
  ['$length', new StringLengthOperator()],
  // ... add other operators
]);

export * from './contains.operator';
export * from './starts-with.operator';
export * from './ends-with.operator';
export * from './regex.operator';
export * from './length.operator'; 