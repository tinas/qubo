import { Operator } from '../types';
import { QuboError } from '../errors';

export const $eq: Operator = {
  name: '$eq',
  fn: (value: unknown, operand: unknown) => value === operand,
};

export const $neq: Operator = {
  name: '$neq',
  fn: (value: unknown, operand: unknown) => value !== operand,
};

export const $gt: Operator = {
  name: '$gt',
  fn: (value: unknown, operand: unknown) => {
    if (typeof value === 'number' && typeof operand === 'number') {
      return value > operand;
    }
    return false;
  },
};

export const $gte: Operator = {
  name: '$gte',
  fn: (value: unknown, operand: unknown) => {
    if (typeof value === 'number' && typeof operand === 'number') {
      return value >= operand;
    }
    return false;
  },
};

export const $lt: Operator = {
  name: '$lt',
  fn: (value: unknown, operand: unknown) => {
    if (typeof value === 'number' && typeof operand === 'number') {
      return value < operand;
    }
    return false;
  },
};

export const $lte: Operator = {
  name: '$lte',
  fn: (value: unknown, operand: unknown) => {
    if (typeof value === 'number' && typeof operand === 'number') {
      return value <= operand;
    }
    return false;
  },
};

export const $in: Operator = {
  name: '$in',
  fn: (value: unknown, operand: unknown) => {
    if (!Array.isArray(operand)) {
      throw new QuboError('$in requires an array as its argument');
    }
    return operand.includes(value);
  },
};

export const $nin: Operator = {
  name: '$nin',
  fn: (value: unknown, operand: unknown) => {
    if (!Array.isArray(operand)) {
      throw new QuboError('$nin requires an array as its argument');
    }
    return !operand.includes(value);
  },
};

export const $regex: Operator = {
  name: '$regex',
  fn: (value: unknown, operand: unknown) => {
    if (typeof value !== 'string') return false;
    if (!(operand instanceof RegExp || typeof operand === 'string')) {
      throw new QuboError('$regex requires a string or RegExp as its argument');
    }
    const regex = typeof operand === 'string' ? new RegExp(operand) : operand;
    return regex.test(value);
  },
};
