// Base operator interface
export interface IOperator<TValue = any, TTarget = any> {
  evaluate(value: TValue, targetValue: TTarget): boolean;
}

// Operator registry type
export type OperatorMap = Map<string, IOperator>;

// Built-in operator types
export type ComparisonOperator = '$eq' | '$gt' | '$gte' | '$lt' | '$lte' | '$ne' | '$in' | '$nin';
export type LogicalOperator = '$and' | '$or' | '$not';

// Specific operator types
export interface IComparisonOperator<T> extends IOperator<T, T> {}
export interface IArrayOperator<T = any> extends IOperator<T[], any> {}
export interface IStringOperator extends IOperator<string, string> {}
export interface IDateOperator<TTarget = Date | string> extends IOperator<Date, TTarget> {} 