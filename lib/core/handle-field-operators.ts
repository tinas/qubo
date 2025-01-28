import { OperatorFunction } from '../types';
import { createError } from './utils/create-error';
import { getNestedValue } from './utils/get-nested-value';

/**
 * Handles field-specific operators in a query
 * @template T The type of document being evaluated
 * @param document The document to evaluate
 * @param fieldName The field name to check (can be a nested path using dot notation)
 * @param condition The condition to evaluate against the field value
 * @param operators Available operators for evaluation
 * @returns True if the field matches all conditions, false otherwise
 * @throws {Error} If an unsupported operator is encountered or if $eq operator is missing
 *
 * This function handles two types of conditions:
 * 1. Object conditions with operator keys (e.g., { $gt: 5, $lt: 10 })
 * 2. Direct value comparison using $eq operator (e.g., "value" is treated as { $eq: "value" })
 */
export function handleFieldOperators<T>(
  document: T,
  fieldName: string,
  condition: unknown,
  operators: Record<string, OperatorFunction<T>>,
): boolean {
  const fieldValue = getNestedValue(document, fieldName);

  if (
    typeof condition === 'object' &&
    condition !== null &&
    !Array.isArray(condition)
  ) {
    const subObject = condition as Record<string, unknown>;
    for (const [opKey, opValue] of Object.entries(subObject)) {
      const opFunction = operators[opKey];
      if (!opFunction) {
        createError(`Unsupported operator: ${opKey}`);
      }
      if (!opFunction(fieldValue, opValue, document)) {
        return false;
      }
    }
  } else {
    const eqFunction = operators['$eq'];
    if (!eqFunction) {
      createError('Missing $eq operator definition.');
    }
    if (!eqFunction(fieldValue, condition, document)) {
      return false;
    }
  }
  return true;
}
