import type { IArrayOperator } from '../../operator.types';
import type { QueryValue } from '../../query.types';

export class ArrayContainsAllOperator implements IArrayOperator<QueryValue, QueryValue[]> {
  evaluate(value: QueryValue[], targetValue: QueryValue[]): boolean {
    return Array.isArray(value) && Array.isArray(targetValue) && targetValue.every(item => value.includes(item));
  }
} 