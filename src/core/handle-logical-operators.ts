import { createTypeError } from './utils/create-error'

/**
 * Handles the $and logical operator by evaluating all subqueries
 * @template T The type of document being evaluated
 * @param document The document to evaluate
 * @param subQueries Array of queries that must all be true
 * @param evaluateDocumentFunction Function to evaluate each subquery
 * @returns True if all subqueries match, false otherwise
 * @throws {TypeError} If subQueries is not an array
 */
export function handleAnd<T>(
  document: T,
  subQueries: unknown[],
  evaluateDocumentFunction: (d: T, q: Record<string, unknown>) => boolean,
): boolean {
  if (!Array.isArray(subQueries)) {
    createTypeError('$and expects an array of queries.')
  }
  return subQueries.every((q) => {
    if (typeof q !== 'object' || q === null) return false
    return evaluateDocumentFunction(document, q as Record<string, unknown>)
  })
}

/**
 * Handles the $or logical operator by evaluating all subqueries
 * @template T The type of document being evaluated
 * @param document The document to evaluate
 * @param subQueries Array of queries where at least one must be true
 * @param evaluateDocumentFunction Function to evaluate each subquery
 * @returns True if any subquery matches, false otherwise
 * @throws {TypeError} If subQueries is not an array
 */
export function handleOr<T>(
  document: T,
  subQueries: unknown[],
  evaluateDocumentFunction: (d: T, q: Record<string, unknown>) => boolean,
): boolean {
  if (!Array.isArray(subQueries)) {
    createTypeError('$or expects an array of queries.')
  }
  return subQueries.some((q) => {
    if (typeof q !== 'object' || q === null) return false
    return evaluateDocumentFunction(document, q as Record<string, unknown>)
  })
}
