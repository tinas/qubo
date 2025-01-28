/**
 * Function type for custom operators that evaluate field values against condition values
 * @template T The type of the document being evaluated
 * @param fieldValue The value from the document being evaluated
 * @param conditionValue The value from the query to compare against
 * @param document The entire document being evaluated
 * @returns Whether the condition is satisfied
 */
export type OperatorFunction<T> = (
  fieldValue: unknown,
  conditionValue: unknown,
  document: T
) => boolean;

/**
 * Configuration options for creating a Qubo instance
 * @template T The type of documents being queried
 * @property operators Custom operators to extend the default functionality
 */
export interface QuboOptions<T> {
  operators?: Record<string, OperatorFunction<T>>;
}
