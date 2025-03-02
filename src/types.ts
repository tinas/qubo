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
) => boolean

/**
 * Configuration options for creating a Qubo instance
 * @template T The type of documents being queried
 * @property operators Custom operators to extend the default functionality
 */
export interface QuboOptions<T> {
  operators?: Record<string, OperatorFunction<T>>;
}

/**
 * Represents a Qubo instance that provides MongoDB-like query capabilities
 * for filtering and searching arrays of objects.
 * @template T - The type of objects in your data array
 */
export interface QuboInstance<T> {
  /**
   * Tests a query against all documents in the data source and returns an array of boolean results.
   * Useful when you want to know which documents match without actually retrieving them.
   *
   * @param query - The query object using MongoDB-like syntax (e.g., { value: { $gt: 100 } })
   * @returns An array of booleans where true indicates a match at that index
   *
   * @example
   * ```typescript
   * const matches = qubo.evaluate({ value: { $gt: 100 } });
   * // returns [false, true, true] for documents that match
   * ```
   */
  evaluate(query: Record<string, unknown>): boolean[];

  /**
   * Searches through the data source and returns all documents that match the query.
   * This is the most commonly used method for filtering data.
   *
   * @param query - The query object using MongoDB-like syntax (e.g., { value: { $gt: 100 } })
   * @returns An array of documents that match the query criteria
   *
   * @example
   * ```typescript
   * const highValue = qubo.find({ value: { $gt: 100 } });
   * const fooItems = qubo.find({ category: 'foo', tags: { $elemMatch: 'a' } });
   * ```
   */
  find(query: Record<string, unknown>): T[];

  /**
   * Returns the first document that matches the query, or undefined if no matches are found.
   * Useful when you expect only one match or need just the first matching result.
   *
   * @param query - The query object using MongoDB-like syntax (e.g., { id: 1 })
   * @returns The first matching document or undefined if no matches found
   *
   * @example
   * ```typescript
   * const item = qubo.findOne({ id: 1 });
   * const fooItem = qubo.findOne({ category: 'foo' });
   * ```
   */
  findOne(query: Record<string, unknown>): T | undefined;

  /**
   * Tests if a single document matches the given query criteria.
   * Useful for validating or checking conditions on a specific document.
   *
   * @param document - The document to test against the query
   * @param query - The query object using MongoDB-like syntax (e.g., { value: { $gte: 100 } })
   * @returns true if the document matches the query, false otherwise
   *
   * @example
   * ```typescript
   * const isHighValue = qubo.evaluateOne(item, { value: { $gte: 100 } });
   * const hasTags = qubo.evaluateOne(item, { tags: { $elemMatch: 'a' } });
   * ```
   */
  evaluateOne(document: T, query: Record<string, unknown>): boolean;
}
