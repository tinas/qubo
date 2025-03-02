import { OperatorFunction } from '../types'
import { handleAnd, handleOr } from './handle-logical-operators'
import { handleFieldOperators } from './handle-field-operators'
import { createError } from './utils/create-error'

/**
 * Evaluates a document against a query using the provided operators
 * @template T The type of the document being evaluated
 * @param document The document to evaluate
 * @param query The query to evaluate against
 * @param operators The operators to use for evaluation
 * @returns Whether the document matches the query
 * @throws If an unsupported root operator is encountered
 */
export function evaluateDocument<T>(
  document: T,
  query: Record<string, unknown>,
  operators: Record<string, OperatorFunction<T>>,
): boolean {
  // Iterate through each condition in the query
  for (const [key, condition] of Object.entries(query)) {
    // Handle logical operators that start with $
    if (key.startsWith('$')) {
      switch (key) {
        case '$and': {
          // All conditions in $and must be true
          if (!handleAnd(document, condition as unknown[], (d, q) => evaluateDocument(d, q, operators))) {
            return false
          }
          break
        }
        case '$or': {
          // At least one condition in $or must be true
          if (!handleOr(document, condition as unknown[], (d, q) => evaluateDocument(d, q, operators))) {
            return false
          }
          break
        }
        default: {
          createError(`Unsupported root operator: ${key}`)
        }
      }
    } else {
      // Handle field-specific operators
      if (!handleFieldOperators(document, key, condition, operators)) {
        return false
      }
    }
  }
  return true
}
