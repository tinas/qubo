import { Operator } from '../types';
import { QuboError } from '../errors';

/**
 * $in operator implementation
 * Matches any of the values specified in an array
 */
export const $in: Operator = {
  name: '$in',
  fn: (value: unknown, operand: unknown): boolean => {
    if (!Array.isArray(operand)) {
      throw new QuboError('$in requires an array as its argument');
    }

    if (Array.isArray(value)) {
      return value.some(item => operand.includes(item));
    }

    return operand.includes(value);
  }
};

/**
 * $elemMatch operator implementation
 * Matches documents that contain an array field with at least one element that matches all the specified query criteria
 */
export const $elemMatch: Operator = {
  name: '$elemMatch',
  fn: (value: unknown, query: unknown, evaluateFn: (value: unknown, query: unknown) => boolean): boolean => {
    if (!Array.isArray(value)) {
      return false;
    }

    if (typeof query !== 'object' || query === null) {
      throw new QuboError('$elemMatch requires an object as its argument');
    }

    return value.some(item => evaluateFn(item, query));
  }
};

export const $nin: Operator = {
  name: '$nin',
  fn: (value: unknown, operand: unknown): boolean => {
    if (!Array.isArray(operand)) {
      throw new QuboError('$nin requires an array as its argument');
    }

    if (Array.isArray(value)) {
      return !value.some(item => operand.includes(item));
    }

    return !operand.includes(value);
  }
}; 