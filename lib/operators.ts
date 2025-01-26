import { OperatorFunction } from './types';

const operators = new Map<string, OperatorFunction>();

// Comparison operators
operators.set('$eq', (value: any, condition: any) => value === condition);
operators.set('$ne', (value: any, condition: any) => value !== condition);
operators.set('$gt', (value: any, condition: any) => value > condition);
operators.set('$gte', (value: any, condition: any) => value >= condition);
operators.set('$lt', (value: any, condition: any) => value < condition);
operators.set('$lte', (value: any, condition: any) => value <= condition);
operators.set('$in', (value: any, condition: any[]) => condition.includes(value));
operators.set('$nin', (value: any, condition: any[]) => !condition.includes(value));

// Array operators
operators.set('$all', (value: any[], condition: any[]) => 
  Array.isArray(value) && condition.every(item => value.includes(item))
);
operators.set('$size', (value: any[], condition: number) => 
  Array.isArray(value) && value.length === condition
);

// Helper function for evaluating a query against a document
function evaluateQuery(doc: any, query: Record<string, any>): boolean {
  return Object.entries(query).every(([key, condition]) => {
    // Handle logical operators
    const operatorFn = operators.get(key);
    if (operatorFn) {
      return operatorFn(doc, condition);
    }

    // Handle nested paths using dot notation
    const value = key.split('.').reduce((obj, k) => obj?.[k], doc);

    // Handle regular conditions
    if (typeof condition === 'object' && !Array.isArray(condition) && condition !== null) {
      return Object.entries(condition).every(([op, val]) => {
        const opFn = operators.get(op);
        if (!opFn) {
          throw new Error(`Unknown operator: ${op}`);
        }
        return opFn(value, val);
      });
    }

    // Handle direct value comparison
    return value === condition;
  });
}

operators.set('$elemMatch', (value: any[], condition: Record<string, any>) => {
  if (!Array.isArray(value)) return false;
  return value.some(item => evaluateQuery(item, condition));
});

// Element operators
operators.set('$exists', (value: any, condition: boolean) => 
  (value !== undefined) === condition
);
operators.set('$type', (value: any, condition: string) => 
  typeof value === condition || 
  (condition === 'array' && Array.isArray(value)) ||
  (condition === 'null' && value === null)
);

// Logical operators
operators.set('$and', (doc: any, conditions: Record<string, any>[]) => 
  conditions.every(condition => evaluateQuery(doc, condition))
);

operators.set('$or', (doc: any, conditions: Record<string, any>[]) => 
  conditions.some(condition => evaluateQuery(doc, condition))
);

operators.set('$not', (value: any, condition: Record<string, any>) => 
  !Object.entries(condition).every(([key, cond]) => {
    const operatorFn = operators.get(key);
    if (operatorFn) {
      return operatorFn(value, cond);
    }
    return value === cond;
  })
);

operators.set('$nor', (doc: any, conditions: Record<string, any>[]) => 
  !conditions.some(condition => evaluateQuery(doc, condition))
);

export function getOperator(name: string): OperatorFunction | undefined {
  return operators.get(name);
}

export function registerOperator(name: string, fn: OperatorFunction): void {
  operators.set(name, fn);
}

export function registerOperators(newOperators: Record<string, OperatorFunction>): void {
  Object.entries(newOperators).forEach(([name, fn]) => {
    operators.set(name, fn);
  });
} 