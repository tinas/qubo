import { Operator } from '../types';
import { QuboError } from '../errors';

export const $and: Operator = {
  name: '$and',
  fn: (value: unknown, conditions: unknown, evaluateFn: (value: unknown, query: unknown) => boolean): boolean => {
    if (!Array.isArray(conditions)) {
      throw new QuboError('$and requires an array of conditions');
    }

    return conditions.every(condition => {
      if (typeof condition !== 'object' || condition === null) {
        throw new QuboError('Each condition in $and must be an object');
      }
      return evaluateFn(value, condition);
    });
  },
};

export const $or: Operator = {
  name: '$or',
  fn: (value: unknown, conditions: unknown, evaluateFn: (value: unknown, query: unknown) => boolean): boolean => {
    if (!Array.isArray(conditions)) {
      throw new QuboError('$or requires an array of conditions');
    }

    return conditions.some(condition => {
      if (typeof condition !== 'object' || condition === null) {
        throw new QuboError('Each condition in $or must be an object');
      }
      return evaluateFn(value, condition);
    });
  },
};

export const $not: Operator = {
  name: '$not',
  fn: (value: unknown, condition: unknown, evaluateFn: (value: unknown, query: unknown) => boolean): boolean => {
    if (typeof condition !== 'object' || condition === null) {
      throw new QuboError('$not requires an object as its argument');
    }
    return !evaluateFn(value, condition);
  },
};

export const $nor: Operator = {
  name: '$nor',
  fn: (value: unknown, conditions: unknown, evaluateFn: (value: unknown, query: unknown) => boolean): boolean => {
    if (!Array.isArray(conditions)) {
      throw new QuboError('$nor requires an array of conditions');
    }

    return !conditions.some(condition => {
      if (typeof condition !== 'object' || condition === null) {
        throw new QuboError('Each condition in $nor must be an object');
      }
      return evaluateFn(value, condition);
    });
  },
};
