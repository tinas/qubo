import { arrayOperators } from './array-operators';
import { comparisonOperators } from './comparison-operators';
import { dateOperators } from './date-operators';
import { stringOperators } from './string-operators';

export const operators = {
  ...arrayOperators,
  ...comparisonOperators,
  ...dateOperators,
  ...stringOperators,
};

export * from './comparison';
export * from './string';
export * from './date';
export * from './array';
