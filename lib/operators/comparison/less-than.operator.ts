import type { ComparableValue, IOperator } from '../../operator.types';

export class LessThanOperator implements IOperator<ComparableValue, ComparableValue> {
  evaluate(value: ComparableValue, targetValue: ComparableValue): boolean {
    return value < targetValue;
  }
} 