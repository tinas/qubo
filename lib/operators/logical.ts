import { Operator } from '../types';

export const $and: Operator = {
  name: '$and',
  fn: (conditions: boolean[]) => {
    if (Array.isArray(conditions)) {
      return conditions.every(Boolean);
    }
    return false;
  },
};

export const $or: Operator = {
  name: '$or',
  fn: (conditions: boolean[]) => {
    if (Array.isArray(conditions)) {
      return conditions.some(Boolean);
    }
    return false;
  },
};

export const $not: Operator = {
  name: '$not',
  fn: (condition: boolean) => !condition,
};

export const $nor: Operator = {
  name: '$nor',
  fn: (conditions: boolean[]) => {
    if (Array.isArray(conditions)) {
      return !conditions.some(Boolean);
    }
    return true;
  },
};
