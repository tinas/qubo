import type { IOperator, OperatorMap } from '../operator.types';

export class ArrayLengthOperator implements IOperator {
  evaluate(value: any[], targetValue: number): boolean {
    return Array.isArray(value) && value.length === targetValue;
  }
}

export class ArrayContainsOperator implements IOperator {
  evaluate(value: any[], targetValue: any): boolean {
    return Array.isArray(value) && value.includes(targetValue);
  }
}

export class ArrayContainsAllOperator implements IOperator {
  evaluate(value: any[], targetValue: any[]): boolean {
    return Array.isArray(value) && Array.isArray(targetValue) &&
           targetValue.every(item => value.includes(item));
  }
}

export class ArrayContainsAnyOperator implements IOperator {
  evaluate(value: any[], targetValue: any[]): boolean {
    return Array.isArray(value) && Array.isArray(targetValue) &&
           targetValue.some(item => value.includes(item));
  }
}

export class ArrayEmptyOperator implements IOperator {
  evaluate(value: any[]): boolean {
    return Array.isArray(value) && value.length === 0;
  }
}

// Array operators package
export const arrayOperators = new Map<string, IOperator>([
  ['$length', new ArrayLengthOperator()],
  ['$contains', new ArrayContainsOperator()],
  ['$containsAll', new ArrayContainsAllOperator()],
  ['$containsAny', new ArrayContainsAnyOperator()],
  ['$empty', new ArrayEmptyOperator()],
]); 