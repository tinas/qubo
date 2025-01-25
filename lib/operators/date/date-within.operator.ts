import type { IDateOperator } from '../../operator.types';
import { BaseOperator } from '../base.operator';

export class DateWithinOperator extends BaseOperator<Date, { days: number }> implements IDateOperator<{ days: number }> {
  evaluate(value: Date, targetValue: { days: number }): boolean {
    if (!(value instanceof Date) || !targetValue || typeof targetValue.days !== 'number' || isNaN(targetValue.days)) return false;
    if (targetValue.days < 0) return false;
    if (isNaN(value.getTime())) return false;

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - value.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= targetValue.days;
  }

  protected getCacheKey(value: Date, targetValue: { days: number }): string {
    if (!(value instanceof Date)) return 'invalid';
    const now = new Date();
    return `${value.getTime()}-${targetValue?.days ?? 'invalid'}-${now.toDateString()}`;
  }
} 