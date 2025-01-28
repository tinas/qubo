import { OperatorFunction } from '../../types';
import { evaluateDocument } from '../evaluate-document';

/**
 * Creates an operator function that matches array elements against a query
 * @template T The type of documents being queried
 * @param allOperators All available operators for query evaluation
 * @returns An operator function that checks if any array element matches the query
 *
 * This operator allows querying array fields where at least one element
 * matches all the conditions specified in the query.
 */
export function createElementMatchOperator<T>(
  allOperators: Record<string, OperatorFunction<T>>,
): OperatorFunction<T> {
  return (fieldValue, conditionValue, _document) => {
    if (!Array.isArray(fieldValue)) return false;
    return fieldValue.some((element) => {
      return evaluateDocument(element as T, conditionValue as Record<string, unknown>, allOperators);
    });
  };
}
