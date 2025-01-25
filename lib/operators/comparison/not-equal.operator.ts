import type { IOperator } from '../../operator.types';
import type { QueryValue } from '../../query.types';

export class NotEqualOperator implements IOperator<QueryValue, QueryValue> {
  evaluate(value: QueryValue, targetValue: QueryValue): boolean {
    return value !== targetValue;
  }
} 