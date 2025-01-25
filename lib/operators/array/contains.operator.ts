import type { IArrayOperator } from '../../operator.types';
import type { QueryValue } from '../../query.types';

export class ArrayContainsOperator implements IArrayOperator<QueryValue, QueryValue> {
  evaluate(value: QueryValue[], targetValue: QueryValue): boolean {
    return Array.isArray(value) && value.includes(targetValue);
  }
} 