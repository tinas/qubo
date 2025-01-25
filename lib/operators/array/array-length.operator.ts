import type { IArrayOperator } from '../../operator.types';
import { BaseOperator } from '../base.operator';

export class ArrayLengthOperator<T> extends BaseOperator<T[], number> implements IArrayOperator<T> {
  protected evaluateInternal(value: T[], targetValue: number): boolean {
    // Array.isArray check is faster than instanceof Array
    return Array.isArray(value) && value.length === targetValue;
  }

  protected getCacheKey(value: T[], targetValue: number): string {
    // Only need to cache based on array length and target value
    return `${Array.isArray(value) ? value.length : 'invalid'}-${targetValue}`;
  }
} 