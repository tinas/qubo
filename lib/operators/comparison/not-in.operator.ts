import type { IOperator } from '../../operator.types';
import type { QueryValue } from '../../query.types';

export class NotInOperator implements IOperator<QueryValue, QueryValue[]> {
  evaluate(value: QueryValue, targetValue: QueryValue[]): boolean {
    return !Array.isArray(targetValue) || !targetValue.includes(value);
  }
} 