import { type OperatorFunction } from '../types';
import { createTypeError } from '../errors';

/**
 * Matches all the specified conditions
 */
export const $and: OperatorFunction = (
  value: unknown,
  operand: unknown,
  evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean,
) => {
  if (!Array.isArray(operand)) {
    throw createTypeError('$and requires an array as its argument');
  }

  if (!evaluateFunction) {
    throw createTypeError('$and requires an evaluate function');
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
    throw createTypeError('$or requires an array as its argument');
  }

  if (!evaluateFunction) {
    throw createTypeError('$or requires an evaluate function');
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
    throw createTypeError('$not requires an object as its argument');
  }

  if (!evaluateFunction) {
    throw createTypeError('$not requires an evaluate function');
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
    throw createTypeError('$nor requires an array as its argument');
  }

  if (!evaluateFunction) {
    throw createTypeError('$nor requires an evaluate function');
  }

  return operand.every((condition) => {
    if (typeof condition !== 'object' || condition === null) {
      return true;
    }
    return !evaluateFunction(value, condition as Record<string, unknown>);
  });
};
