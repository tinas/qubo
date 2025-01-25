import type { IArrayOperator } from '../../operator.types';
import type { QueryValue } from '../../query.types';

export class ArrayContainsAnyOperator implements IArrayOperator<QueryValue, QueryValue[]> {
  evaluate(value: QueryValue[], targetValue: QueryValue[]): boolean {
    return Array.isArray(value) && Array.isArray(targetValue) &&
           targetValue.some(item => value.includes(item));
  }
} 