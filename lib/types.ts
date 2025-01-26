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
}

/**
 * Configuration options for creating a Qubo instance
 */
export type QuboOptions = {
  /**
   * Additional custom operators to extend Qubo's functionality
   * Each operator must have a name starting with '$'
   */
  operators?: CustomOperator[];
};

/**
 * Custom operator definition for extending Qubo's functionality
 */
export type CustomOperator = {
  /**
   * The name of the operator, must start with '$'
   */
  name: string;

  /**
   * The function that implements the operator's logic
   * @param value The value to compare
   * @param operand The operand to compare against
   * @returns A boolean indicating if the condition is met
   */
  fn: (value: unknown, operand: unknown) => boolean;
};

/**
 * Internal operator type used by Qubo
 */
export type Operator = {
  /**
   * The name of the operator, must start with '$'
   */
  name: string;

  /**
   * The function that implements the operator's logic
   * @param value The value to compare
   * @param operand The operand to compare against
   * @param evaluateFunction The function to evaluate nested queries
   * @returns A boolean indicating if the condition is met
   */
  fn: (
    value: unknown,
    operand: unknown,
    evaluateFunction: (value: unknown, query: Record<string, unknown>) => boolean
  ) => boolean;
};

/**
 * Built-in comparison operators for querying values
 */
export type ComparisonOperator = '$eq' | '$neq' | '$gt' | '$gte' | '$lt' | '$lte' | '$regex';

/**
 * Built-in logical operators for combining conditions
 */
export type LogicalOperator = '$and' | '$or' | '$not' | '$nor';

/**
 * Built-in array operators for querying array fields
 */
export type ArrayOperator = '$elementMatch' | '$in' | '$nin';

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
  [K in LogicalOperator]?: Query | Query[];
};

/**
 * Query structure for array operations
 */
export type ArrayQuery = {
  [K in ArrayOperator]?: Query;
};

/**
 * The main query type that can be used to find documents
 * Supports nested queries and various operator types
 */
export type Query = Record<string, unknown>;
