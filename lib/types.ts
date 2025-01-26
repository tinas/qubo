/**
 * MongoDB-like operators
 */
export type ComparisonOperator = '$eq' | '$gt' | '$gte' | '$in' | '$lt' | '$lte' | '$ne' | '$nin';
export type LogicalOperator = '$and' | '$not' | '$nor' | '$or';
export type ArrayOperator = '$all' | '$elemMatch' | '$size';
export type ElementOperator = '$exists' | '$type';

export type Operator = ComparisonOperator | LogicalOperator | ArrayOperator | ElementOperator;

/**
 * Query types
 */
export type QueryValue = any;
export type QueryCondition = Record<string, any>;

export type Query<T> = {
  [P in keyof T]?: T[P] | QueryCondition;
} & {
  [key: string]: any;
};

/**
 * Custom operator types
 */
export type OperatorFunction = (value: any, condition: any) => boolean;

export type CustomOperators = {
  [key: string]: OperatorFunction;
};

/**
 * Store types
 */
export interface QuboStore<T> {
  data: T[];
  find: (query: Query<T>) => T[];
  findOne: (query: Query<T>) => T | null;
  evaluate: (doc: T, query: Query<T>) => boolean;
}

export interface QuboOptions {
  operators?: Record<string, OperatorFunction>;
}

/**
 * Result types
 */
export type FindResult<T> = T[];
export type FindOneResult<T> = T | null;
export type EvaluateResult = boolean; 