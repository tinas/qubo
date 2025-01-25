import type { IQueryExecutor } from './executor.types';
import type { Query } from './query.types';
import type { IOperator, OperatorMap, LogicalOperator } from './operator.types';
import { defaultOperators } from './operators/comparison-operators';

export class QueryExecutor<T> implements IQueryExecutor<T> {
  private operators: OperatorMap;

  constructor(
    private source: T[],
    customOperators: OperatorMap = new Map()
  ) {
    // Merge default and custom operators
    this.operators = new Map([...defaultOperators, ...customOperators]);
  }

  find(query: Query<T>): T[] {
    return this.source.filter(item => this.evaluateQuery(item, query));
  }

  findOne(query: Query<T>): T | null {
    return this.find(query)[0] || null;
  }

  // Add a custom operator at runtime
  addOperator(name: string, operator: IOperator): void {
    if (!name.startsWith('$')) {
      throw new Error('Custom operator names must start with $');
    }
    this.operators.set(name, operator);
  }

  // Remove a custom operator
  removeOperator(name: string): void {
    if (defaultOperators.has(name)) {
      throw new Error('Cannot remove built-in operators');
    }
    this.operators.delete(name);
  }

  private evaluateQuery(item: T, query: Query<T>): boolean {
    return Object.entries(query).every(([key, condition]) => {
      if (this.isLogicalOperator(key)) {
        return this.evaluateLogicalOperator(item, key as LogicalOperator, condition as Query<T>[]);
      }
      return this.evaluateFieldCondition(item, key, condition);
    });
  }

  private isLogicalOperator(operator: string): operator is LogicalOperator {
    return ['$and', '$or', '$not'].includes(operator);
  }

  private evaluateLogicalOperator(item: T, operator: LogicalOperator, conditions: Query<T>[]): boolean {
    switch (operator) {
      case '$and':
        return conditions.every(condition => this.evaluateQuery(item, condition));
      case '$or':
        return conditions.some(condition => this.evaluateQuery(item, condition));
      case '$not':
        return !conditions.some(condition => this.evaluateQuery(item, condition));
      default:
        return false;
    }
  }

  private evaluateFieldCondition(item: T, field: string, condition: any): boolean {
    const value = this.getFieldValue(item, field);
    
    if (this.isPrimitiveCondition(condition)) {
      return value === condition;
    }

    return Object.entries(condition).every(([operator, targetValue]) => {
      const operatorInstance = this.operators.get(operator);
      if (!operatorInstance) {
        throw new Error(`Unknown operator: ${operator}`);
      }
      return operatorInstance.evaluate(value, targetValue);
    });
  }

  private isPrimitiveCondition(condition: any): boolean {
    return typeof condition !== 'object' || condition === null;
  }

  private getFieldValue(item: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], item);
  }
} 