import type { IOperator, OperatorMap } from '../operator.types';

export class ContainsOperator implements IOperator {
  evaluate(value: string, targetValue: string): boolean {
    return typeof value === 'string' && value.includes(targetValue);
  }
}

export class StartsWithOperator implements IOperator {
  evaluate(value: string, targetValue: string): boolean {
    return typeof value === 'string' && value.startsWith(targetValue);
  }
}

export class EndsWithOperator implements IOperator {
  evaluate(value: string, targetValue: string): boolean {
    return typeof value === 'string' && value.endsWith(targetValue);
  }
}

export class RegexOperator implements IOperator {
  evaluate(value: string, pattern: string): boolean {
    if (typeof value !== 'string') return false;
    try {
      return new RegExp(pattern).test(value);
    } catch {
      return false;
    }
  }
}

export class LengthOperator implements IOperator {
  evaluate(value: string, targetValue: number): boolean {
    return typeof value === 'string' && value.length === targetValue;
  }
}

// String operators package
export const stringOperators = new Map<string, IOperator>([
  ['$contains', new ContainsOperator()],
  ['$startsWith', new StartsWithOperator()],
  ['$endsWith', new EndsWithOperator()],
  ['$regex', new RegexOperator()],
  ['$length', new LengthOperator()],
]); 