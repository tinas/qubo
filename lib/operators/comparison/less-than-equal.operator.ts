import type { ComparableValue, IOperator } from '../../operator.types';

export class LessThanEqualOperator implements IOperator<ComparableValue, ComparableValue> {
  evaluate(value: ComparableValue, targetValue: ComparableValue): boolean {
    return value <= targetValue;
  }
} 