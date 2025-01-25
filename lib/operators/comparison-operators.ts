import type { IOperator } from '../operator.types';

export class EqualOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value === targetValue;
  }
}

export class NotEqualOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value !== targetValue;
  }
}

export class GreaterThanOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value > targetValue;
  }
}

export class GreaterThanEqualOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value >= targetValue;
  }
}

export class LessThanOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value < targetValue;
  }
}

export class LessThanEqualOperator implements IOperator {
  evaluate(value: any, targetValue: any): boolean {
    return value <= targetValue;
  }
}

export class InOperator implements IOperator {
  evaluate(value: any, targetValue: any[]): boolean {
    return Array.isArray(targetValue) && targetValue.includes(value);
  }
}

export class NotInOperator implements IOperator {
  evaluate(value: any, targetValue: any[]): boolean {
    return Array.isArray(targetValue) && !targetValue.includes(value);
  }
}

// Default operator map
export const defaultOperators = new Map<string, IOperator>([
  ['$eq', new EqualOperator()],
  ['$ne', new NotEqualOperator()],
  ['$gt', new GreaterThanOperator()],
  ['$gte', new GreaterThanEqualOperator()],
  ['$lt', new LessThanOperator()],
  ['$lte', new LessThanEqualOperator()],
  ['$in', new InOperator()],
  ['$nin', new NotInOperator()],
]); 