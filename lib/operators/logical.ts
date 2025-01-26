import { type Operator } from '../types';

/**
 * Matches all the specified conditions
 */
export const $and: Operator = {
  name: '$and',
  fn: (
    value: unknown,
    operand: unknown,
    evaluateFunction: (value: unknown, query: Record<string, unknown>) => boolean,
  ) => {
    if (!Array.isArray(operand)) {
      return false;
    }

    return operand.every((condition) => {
      if (typeof condition !== 'object' || condition === null) {
        return false;
      }
      return evaluateFunction(value, condition as Record<string, unknown>);
    });
  },
};

/**
 * Matches any of the specified conditions
 */
export const $or: Operator = {
  name: '$or',
  fn: (
    value: unknown,
    operand: unknown,
    evaluateFunction: (value: unknown, query: Record<string, unknown>) => boolean,
  ) => {
    if (!Array.isArray(operand)) {
      return false;
    }

    return operand.some((condition) => {
      if (typeof condition !== 'object' || condition === null) {
        return false;
      }
      return evaluateFunction(value, condition as Record<string, unknown>);
    });
  },
};

/**
 * Inverts the specified condition
 */
export const $not: Operator = {
  name: '$not',
  fn: (
    value: unknown,
    operand: unknown,
    evaluateFunction: (value: unknown, query: Record<string, unknown>) => boolean,
  ) => {
    if (typeof operand !== 'object' || operand === null) {
      return false;
    }

    return !evaluateFunction(value, operand as Record<string, unknown>);
  },
};

/**
 * Matches none of the specified conditions
 */
export const $nor: Operator = {
  name: '$nor',
  fn: (
    value: unknown,
    operand: unknown,
    evaluateFunction: (value: unknown, query: Record<string, unknown>) => boolean,
  ) => {
    if (!Array.isArray(operand)) {
      return false;
    }

    return operand.every((condition) => {
      if (typeof condition !== 'object' || condition === null) {
        return false;
      }
      return !evaluateFunction(value, condition as Record<string, unknown>);
    });
  },
};
