import { type OperatorFunction } from '../types';

/**
 * Matches any of the values specified in an array
 */
export const $in: OperatorFunction = (value: unknown, operand: unknown) => {
  if (!Array.isArray(operand)) {
    throw new Error('$in requires an array as its argument');
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
    throw new Error('$nin requires an array as its argument');
  }

  if (Array.isArray(value)) {
    return !value.some((item) => operand.includes(item));
  }

  return !operand.includes(value);
};

/**
 * Matches array elements that match all the specified nested conditions
 */
export const $elemMatch: OperatorFunction = (
  value: unknown,
  operand: unknown,
  evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean,
) => {
  if (!Array.isArray(value)) {
    return false;
  }

  if (typeof operand !== 'object' || operand === null) {
    throw new Error('$elemMatch requires an object as its argument');
  }

  if (!evaluateFunction) {
    throw new Error('$elemMatch requires an evaluate function');
  }

  return value.some((item) => evaluateFunction(item, operand as Record<string, unknown>));
};
