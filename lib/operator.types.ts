/**
 * Base operator interface that all operators must implement.
 * @template TValue - The type of the value to evaluate
 * @template TTarget - The type of the target value to compare against
 */
export interface IOperator<TValue = any, TTarget = any> {
  /**
   * Evaluates if the given value matches the target value according to the operator's logic.
   * @param value - The value to evaluate
   * @param targetValue - The target value to compare against
   * @returns True if the value matches the target value according to the operator's logic
   */
  evaluate(value: TValue, targetValue: TTarget): boolean;
}

/**
 * A map of operator names to their implementations.
 */
export type OperatorMap = Map<string, IOperator>;

/**
 * Built-in comparison operator types.
 */
export type ComparisonOperator = '$eq' | '$gt' | '$gte' | '$lt' | '$lte' | '$ne' | '$in' | '$nin';

/**
 * Built-in logical operator types.
 */
export type LogicalOperator = '$and' | '$or' | '$not';

/**
 * Interface for comparison operators that compare values of the same type.
 * @template T - The type of values being compared
 */
export interface IComparisonOperator<T> extends IOperator<T, T> {}

/**
 * Interface for array operators that work with arrays of any type.
 * @template T - The type of array elements
 */
export interface IArrayOperator<T = any> extends IOperator<T[], any> {}

/**
 * Interface for string operators that work with string values.
 */
export interface IStringOperator extends IOperator<string, string> {}

/**
 * Interface for date operators that work with Date objects.
 * @template TTarget - The type of the target value (Date or string)
 */
export interface IDateOperator<TTarget = Date | string> extends IOperator<Date, TTarget> {} 