import { Operator } from '../types';

export const $eq: Operator = {
  name: '$eq',
  fn: (a: unknown, b: unknown) => a === b,
};

export const $neq: Operator = {
  name: '$neq',
  fn: (a: unknown, b: unknown) => a !== b,
};

export const $gt: Operator = {
  name: '$gt',
  fn: (a: unknown, b: unknown) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a > b;
    }
    return false;
  },
};

export const $gte: Operator = {
  name: '$gte',
  fn: (a: unknown, b: unknown) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a >= b;
    }
    return false;
  },
};

export const $lt: Operator = {
  name: '$lt',
  fn: (a: unknown, b: unknown) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a < b;
    }
    return false;
  },
};

export const $lte: Operator = {
  name: '$lte',
  fn: (a: unknown, b: unknown) => {
    if (typeof a === 'number' && typeof b === 'number') {
      return a <= b;
    }
    return false;
  },
};

export const $in: Operator = {
  name: '$in',
  fn: (a: unknown, b: unknown[]) => {
    if (Array.isArray(b)) {
      return b.includes(a);
    }
    return false;
  },
};

export const $nin: Operator = {
  name: '$nin',
  fn: (a: unknown, b: unknown[]) => {
    if (Array.isArray(b)) {
      return !b.includes(a);
    }
    return true;
  },
};

export const $regex: Operator = {
  name: '$regex',
  fn: (a: unknown, b: string | RegExp) => {
    if (typeof a === 'string') {
      const regex = typeof b === 'string' ? new RegExp(b) : b;
      return regex.test(a);
    }
    return false;
  },
};
