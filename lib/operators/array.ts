import { type OperatorFunction } from '../types';
import { createTypeError } from '../errors';

/**
 * Matches any of the values specified in an array
 */
export const $in: OperatorFunction = (value: unknown, operand: unknown) => {
  if (!Array.isArray(operand)) {
    throw createTypeError('$in requires an array as its argument');
  }

  if (Array.isArray(value)) {
    return value.some((item) => operand.includes(item));
  }

  return operand.includes(value);
};

/**
 * Matches none of the values specified in an array
 */
export const $nin: OperatorFunction = (value: unknown, operand: unknown) => {
  if (!Array.isArray(operand)) {
    throw createTypeError('$nin requires an array as its argument');
  }

  if (Array.isArray(value)) {
    return !value.some((item) => operand.includes(item));
  }

  return !operand.includes(value);
};

/**
 * Matches array elements that match all the specified nested conditions
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export const $elemMatch: OperatorFunction = (
  value: unknown,
  operand: unknown,
  evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean,
) => {
  if (!Array.isArray(value)) {
    return false;
  }

  if (typeof operand !== 'object' || operand === null) {
    throw createTypeError('$elemMatch requires an object as its argument');
  }

  if (!evaluateFunction) {
    throw createTypeError('$elemMatch requires an evaluate function');
  }

  return value.some((item) => evaluateFunction(item, operand as Record<string, unknown>));
};
