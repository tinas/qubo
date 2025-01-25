import type { IComparisonOperator } from '../../operator.types';

export class EqualOperator<T> implements IComparisonOperator<T> {
  evaluate(value: T, targetValue: T): boolean {
    return value === targetValue;
  }
} 