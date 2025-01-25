import { comparisonOperators } from './comparison';
import { stringOperators } from './string';
import { dateOperators } from './date';
import { arrayOperators } from './array';

export const allOperators = new Map([
  ...comparisonOperators,
  ...stringOperators,
  ...dateOperators,
  ...arrayOperators
]);

export * from './comparison';
export * from './string';
export * from './date';
export * from './array'; 