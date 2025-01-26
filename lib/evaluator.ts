import { Query, QueryCondition } from './types';
import { getOperator } from './operators';

export function evaluateCondition(value: any, condition: QueryCondition): boolean {
  return Object.entries(condition).every(([operator, operatorValue]) => {
    const operatorFn = getOperator(operator);
    if (!operatorFn) {
      throw new Error(`Unknown operator: ${operator}`);
    }
    return operatorFn(value, operatorValue);
  });
}

export function evaluateQuery<T>(doc: T, query: Query<T>): boolean {
  return Object.entries(query).every(([key, condition]) => {
    // Handle logical operators
    const operatorFn = getOperator(key);
    if (operatorFn) {
      return operatorFn(doc, condition);
    }

    // Handle nested paths using dot notation
    const value = key.split('.').reduce((obj: Record<string, any>, k) => obj?.[k], doc as Record<string, any>);

    // Handle regular conditions
    if (typeof condition === 'object' && !Array.isArray(condition) && condition !== null) {
      return evaluateCondition(value, condition as QueryCondition);
    }

    // Handle direct value comparison
    return value === condition;
  });
} 