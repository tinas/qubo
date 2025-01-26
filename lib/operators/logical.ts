import { type OperatorFunction } from '../types';

/**
 * Matches all the specified conditions
 */
export const $and: OperatorFunction = (
  value: unknown,
  operand: unknown,
  evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean,
) => {
  if (!Array.isArray(operand)) {
    throw new Error('$and requires an array as its argument');
  }

  if (!evaluateFunction) {
    throw new Error('$and requires an evaluate function');
  }

  return operand.every((condition) => {
    if (typeof condition !== 'object' || condition === null) {
      return false;
    }
    return evaluateFunction(value, condition as Record<string, unknown>);
  });
};

/**
 * Matches any of the specified conditions
 */
export const $or: OperatorFunction = (
  value: unknown,
  operand: unknown,
  evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean,
) => {
  if (!Array.isArray(operand)) {
    throw new Error('$or requires an array as its argument');
  }

  if (!evaluateFunction) {
    throw new Error('$or requires an evaluate function');
  }

  return operand.some((condition) => {
    if (typeof condition !== 'object' || condition === null) {
      return false;
    }
    return evaluateFunction(value, condition as Record<string, unknown>);
  });
};

/**
 * Inverts the specified condition
 */
export const $not: OperatorFunction = (
  value: unknown,
  operand: unknown,
  evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean,
) => {
  if (typeof operand !== 'object' || operand === null) {
    throw new Error('$not requires an object as its argument');
  }

  if (!evaluateFunction) {
    throw new Error('$not requires an evaluate function');
  }

  return !evaluateFunction(value, operand as Record<string, unknown>);
};

/**
 * Matches none of the specified conditions
 */
export const $nor: OperatorFunction = (
  value: unknown,
  operand: unknown,
  evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean,
) => {
  if (!Array.isArray(operand)) {
    throw new Error('$nor requires an array as its argument');
  }

  if (!evaluateFunction) {
    throw new Error('$nor requires an evaluate function');
  }

  return operand.every((condition) => {
    if (typeof condition !== 'object' || condition === null) {
      return false;
    }
    return !evaluateFunction(value, condition as Record<string, unknown>);
  });
};
