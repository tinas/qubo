import type { IArrayOperator } from '../../operator.types';
import type { QueryValue } from '../../query.types';

export class ArrayEmptyOperator implements IArrayOperator<QueryValue, void> {
  evaluate(value: QueryValue[]): boolean {
    return Array.isArray(value) && value.length === 0;
  }
} 