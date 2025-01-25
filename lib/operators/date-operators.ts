import type { IOperator, OperatorMap } from '../operator.types';

export class DateWithinOperator implements IOperator {
  evaluate(value: Date, targetValue: { days: number }): boolean {
    if (!(value instanceof Date)) return false;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - value.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= targetValue.days;
  }
}

export class DateBetweenOperator implements IOperator {
  evaluate(value: Date, targetValue: [Date | string, Date | string]): boolean {
    if (!(value instanceof Date)) return false;
    const [start, end] = targetValue.map(d => new Date(d));
    return value >= start && value <= end;
  }
}

export class DateAfterOperator implements IOperator {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date)) return false;
    return value > new Date(targetValue);
  }
}

export class DateBeforeOperator implements IOperator {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date)) return false;
    return value < new Date(targetValue);
  }
}

export class SameDayOperator implements IOperator {
  evaluate(value: Date, targetValue: Date | string): boolean {
    if (!(value instanceof Date)) return false;
    const target = new Date(targetValue);
    return value.getFullYear() === target.getFullYear() &&
           value.getMonth() === target.getMonth() &&
           value.getDate() === target.getDate();
  }
}

// Date operators package
export const dateOperators = new Map<string, IOperator>([
  ['$dateWithin', new DateWithinOperator()],
  ['$dateBetween', new DateBetweenOperator()],
  ['$dateAfter', new DateAfterOperator()],
  ['$dateBefore', new DateBeforeOperator()],
  ['$sameDay', new SameDayOperator()],
]); 