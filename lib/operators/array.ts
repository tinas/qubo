import { type Operator } from '../types';

/**
 * Matches any of the values specified in an array
 */
export const $in: Operator = {
  name: '$in',
  fn: (value: unknown, operand: unknown) => {
    if (!Array.isArray(operand)) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.some((item) => operand.includes(item));
    }

    return operand.includes(value);
  },
};

/**
 * Matches none of the values specified in an array
 */
export const $nin: Operator = {
  name: '$nin',
  fn: (value: unknown, operand: unknown) => {
    if (!Array.isArray(operand)) {
      return false;
    }

    if (Array.isArray(value)) {
      return !value.some((item) => operand.includes(item));
    }

    return !operand.includes(value);
  },
};

/**
 * Matches array elements that match all the specified nested conditions
 */
export const $elementMatch: Operator = {
  name: '$elementMatch',
  fn: (
    value: unknown,
    operand: unknown,
    evaluateFunction: (value: unknown, query: Record<string, unknown>) => boolean,
  ) => {
    if (!Array.isArray(value)) {
      return false;
    }

    if (typeof operand !== 'object' || operand === null) {
      return false;
    }

    return value.some((item) => evaluateFunction(item, operand as Record<string, unknown>));
  },
};
