import type { IOperator } from '../../operator.types';

export class NotInOperator implements IOperator {
  evaluate(value: any, targetValue: any[]): boolean {
    return Array.isArray(targetValue) && !targetValue.includes(value);
  }
} 