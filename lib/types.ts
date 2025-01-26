/**
 * Main interface for Qubo query operations
 * @template T The type of documents in the collection
 */
export type Qubo<T> = {
  /**
   * Finds all documents that match the given query
   * @param query The query to match documents against
   * @returns An array of matching documents
   */
  find(query: Query): T[];

  /**
   * Finds the first document that matches the given query
   * @param query The query to match documents against
   * @returns The first matching document or null if no match is found
   */
  findOne(query: Query): T | null;

  /**
   * Checks if any document matches the given query
   * @param query The query to match documents against
   * @returns True if at least one document matches, false otherwise
   */
  evaluate(query: Query): boolean;

  /**
   * Registers a new custom operator
   * @param name The name of the operator (must start with $)
   * @param fn The operator function
   */
  registerOperator(name: string, fn: OperatorFunction): void;
}

/**
 * Configuration options for creating a Qubo instance
 */
export type QuboOptions = {
  /**
   * Additional custom operators to extend Qubo's functionality
   * Each operator must have a name starting with '$'
   */
  operators?: Record<string, OperatorFunction>;
};

/**
 * The function type for all operators
 */
export type OperatorFunction = (
  value: unknown,
  operand: unknown,
  evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean,
) => boolean;

/**
 * Built-in comparison operators for querying values
 */
export type ComparisonOperator = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte' | '$regex';

/**
 * Built-in logical operators for combining conditions
 */
export type LogicalOperator = '$and' | '$or' | '$not' | '$nor';

/**
 * Built-in array operators for querying array fields
 */
export type ArrayOperator = '$in' | '$nin' | '$elemMatch';

/**
 * Union of all built-in operator types
 */
export type OperatorType = ComparisonOperator | LogicalOperator | ArrayOperator;

/**
 * Query structure for comparison operations
 */
export type ComparisonQuery = {
  [K in ComparisonOperator]?: unknown;
};

/**
 * Query structure for logical operations
 */
export type LogicalQuery = {
  [K in LogicalOperator]?: Query[];
};

/**
 * Query structure for array operations
 */
export type ArrayQuery = {
  [K in ArrayOperator]?: unknown;
};

/**
 * The main query type that can be used to find documents
 * Supports nested queries and various operator types
 */
export type Query = Record<string, unknown> | ComparisonQuery | LogicalQuery | ArrayQuery;
