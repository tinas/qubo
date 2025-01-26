import { type OperatorFunction } from '../types';
import { createTypeError } from '../errors';

/**
 * Matches values that are equal to a specified value
 */
export const $eq: OperatorFunction = (value: unknown, operand: unknown) => value === operand;

/**
 * Matches values that are not equal to a specified value
 */
export const $ne: OperatorFunction = (value: unknown, operand: unknown) => value !== operand;

/**
 * Matches values that are greater than a specified value
 */
export const $gt: OperatorFunction = (value: unknown, operand: unknown) => {
  if (typeof value !== typeof operand) {
    return false;
  }
  return (value as number | string | Date) > (operand as number | string | Date);
};

/**
 * Matches values that are greater than or equal to a specified value
 */
export const $gte: OperatorFunction = (value: unknown, operand: unknown) => {
  if (typeof value !== typeof operand) {
    return false;
  }
  return (value as number | string | Date) >= (operand as number | string | Date);
};

/**
 * Matches values that are less than a specified value
 */
export const $lt: OperatorFunction = (value: unknown, operand: unknown) => {
  if (typeof value !== typeof operand) {
    return false;
  }
  return (value as number | string | Date) < (operand as number | string | Date);
};

/**
 * Matches values that are less than or equal to a specified value
 */
export const $lte: OperatorFunction = (value: unknown, operand: unknown) => {
  if (typeof value !== typeof operand) {
    return false;
  }
  return (value as number | string | Date) <= (operand as number | string | Date);
};

/**
 * Matches values that satisfy a regular expression pattern
 */
export const $regex: OperatorFunction = (value: unknown, operand: unknown) => {
  if (typeof value !== 'string') {
    return false;
  }

  if (operand instanceof RegExp) {
    return operand.test(value);
  }

  if (typeof operand !== 'string') {
    throw createTypeError('$regex requires a string or RegExp as its argument');
  }

  return new RegExp(operand).test(value);
};
