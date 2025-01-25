import type { IQueryExecutor } from './executor.types';
import type { Query } from './query.types';
import type { IOperator, OperatorMap, LogicalOperator } from './operator.types';
import { comparisonOperators } from './operators/comparison';

/**
 * QueryExecutor class that executes queries against a data source.
 * Supports custom operators and built-in operators for flexible querying.
 * 
 * @template T - The type of items in the data source
 */
export class QueryExecutor<T> implements IQueryExecutor<T> {
  private operators: OperatorMap;

  /**
   * Creates a new QueryExecutor instance.
   * 
   * @param source - The array of items to query against
   * @param customOperators - Optional map of custom operators to use in addition to default operators
   */
  constructor(
    private source: T[],
    customOperators: OperatorMap = new Map()
  ) {
    // Merge default and custom operators
    this.operators = new Map([...comparisonOperators, ...customOperators]);
  }

  /**
   * Finds all items in the source that match the given query.
   * 
   * @param query - The query to execute
   * @returns An array of items that match the query
   */
  find(query: Query<T>): T[] {
    return this.source.filter(item => this.evaluateQuery(item, query));
  }

  /**
   * Finds the first item in the source that matches the given query.
   * 
   * @param query - The query to execute
   * @returns The first matching item, or null if no match is found
   */
  findOne(query: Query<T>): T | null {
    return this.find(query)[0] || null;
  }

  /**
   * Adds a custom operator at runtime.
   * Custom operator names must start with $.
   * 
   * @param name - The name of the operator (must start with $)
   * @param operator - The operator implementation
   * @throws Error if the operator name doesn't start with $
   */
  addOperator(name: string, operator: IOperator): void {
    if (!name.startsWith('$')) {
      throw new Error('Custom operator names must start with $');
    }
    this.operators.set(name, operator);
  }

  /**
   * Removes a custom operator.
   * Built-in operators cannot be removed.
   * 
   * @param name - The name of the operator to remove
   * @throws Error if attempting to remove a built-in operator
   */
  removeOperator(name: string): void {
    if (comparisonOperators.has(name)) {
      throw new Error('Cannot remove built-in operators');
    }
    this.operators.delete(name);
  }

  /**
   * Evaluates a query against an item.
   * 
   * @param item - The item to evaluate
   * @param query - The query to evaluate
   * @returns True if the item matches the query
   * @private
   */
  private evaluateQuery(item: T, query: Query<T>): boolean {
    return Object.entries(query).every(([key, condition]) => {
      if (this.isLogicalOperator(key)) {
        return this.evaluateLogicalOperator(item, key as LogicalOperator, condition as Query<T>[]);
      }
      return this.evaluateFieldCondition(item, key, condition);
    });
  }

  /**
   * Checks if the given key is a logical operator.
   * 
   * @param key - The key to check
   * @returns True if the key is a logical operator
   * @private
   */
  private isLogicalOperator(key: string): boolean {
    return key === '$and' || key === '$or' || key === '$not';
  }

  /**
   * Evaluates a logical operator against an item.
   * 
   * @param item - The item to evaluate
   * @param operator - The logical operator to apply
   * @param conditions - The conditions to evaluate
   * @returns True if the logical operation succeeds
   * @private
   */
  private evaluateLogicalOperator(item: T, operator: LogicalOperator, conditions: Query<T>[]): boolean {
    switch (operator) {
      case '$and':
        return conditions.every(condition => this.evaluateQuery(item, condition));
      case '$or':
        return conditions.some(condition => this.evaluateQuery(item, condition));
      case '$not':
        return !this.evaluateQuery(item, conditions[0]);
      default:
        return false;
    }
  }

  /**
   * Evaluates a field condition against an item.
   * 
   * @param item - The item to evaluate
   * @param field - The field to check
   * @param condition - The condition to evaluate
   * @returns True if the field condition succeeds
   * @private
   */
  private evaluateFieldCondition(item: T, field: string, condition: unknown): boolean {
    const value = this.getFieldValue(item, field);
    if (typeof condition === 'object' && condition !== null) {
      return Object.entries(condition as Record<string, unknown>).every(([op, target]) => {
        const operator = this.operators.get(op);
        return operator ? operator.evaluate(value, target) : false;
      });
    }
    const equalsOperator = this.operators.get('$eq');
    return equalsOperator ? equalsOperator.evaluate(value, condition) : false;
  }

  /**
   * Gets the value of a field from an item, supporting nested paths.
   * 
   * @param item - The item to get the value from
   * @param field - The field path (e.g. 'user.address.city')
   * @returns The value at the specified path
   * @private
   */
  private getFieldValue(item: T, field: string): unknown {
    return field.split('.').reduce((obj, key) => {
      return obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined;
    }, item as unknown);
  }
} 