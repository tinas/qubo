import type { IArrayOperator } from '../../operator.types';
import { BaseOperator } from '../base.operator';

export class ArrayLengthOperator<T> extends BaseOperator<T[], number> implements IArrayOperator<T> {
  evaluate(value: T[], targetValue: number): boolean {
    return Array.isArray(value) && value.length === targetValue;
  }

  protected getCacheKey(value: T[], targetValue: number): string {
    // Only need to cache based on array length and target value
    return `${Array.isArray(value) ? value.length : 'invalid'}-${targetValue}`;
  }
} 