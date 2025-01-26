/**
 * Base operator class that provides common functionality for all operators.
 *
 * @template TValue - The type of the value to evaluate
 * @template TTarget - The type of the target value to compare against
 */
export abstract class BaseOperator<T, C = unknown> {
  /**
   * Evaluates if the given value matches the target condition.
   *
   * @param value - The value to evaluate
   * @param condition - The condition to evaluate against
   * @returns True if the value matches the condition, false otherwise
   */
  abstract evaluate(value: T, condition: C): boolean;
}
