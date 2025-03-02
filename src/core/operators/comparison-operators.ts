import { OperatorFunction } from '../../types'

/**
 * Creates a set of comparison operators for querying documents
 * @template T The type of documents being queried
 * @returns An object containing all comparison operator functions
 */
export function createComparisonOperators<T>(): Record<string, OperatorFunction<T>> {
  return {
    /**
     * Checks if field value equals condition value
     * For arrays, checks if the array includes the condition value
     */
    $eq: (fieldValue, conditionValue) => {
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(conditionValue)
      }
      return fieldValue === conditionValue
    },

    /**
     * Checks if field value does not equal condition value
     * For arrays, checks if the array does not include the condition value
     */
    $ne: (fieldValue, conditionValue) => {
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(conditionValue)
      }
      return fieldValue !== conditionValue
    },

    /**
     * Checks if field value is greater than condition value
     * For arrays, checks if any element is greater than condition value
     */
    $gt: (fieldValue, conditionValue) => {
      if (typeof conditionValue !== 'number') return false
      // If fieldValue is array, check if at least one element > conditionValue
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((value) => typeof value === 'number' && value > conditionValue)
      }
      if (typeof fieldValue === 'number') {
        return fieldValue > conditionValue
      }
      return false
    },

    /**
     * Checks if field value is greater than or equal to condition value
     * For arrays, checks if any element is greater than or equal to condition value
     */
    $gte: (fieldValue, conditionValue) => {
      if (typeof conditionValue !== 'number') return false
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((value) => typeof value === 'number' && value >= conditionValue)
      }
      if (typeof fieldValue === 'number') {
        return fieldValue >= conditionValue
      }
      return false
    },

    /**
     * Checks if field value is less than condition value
     * For arrays, checks if any element is less than condition value
     */
    $lt: (fieldValue, conditionValue) => {
      if (typeof conditionValue !== 'number') return false
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((value) => typeof value === 'number' && value < conditionValue)
      }
      if (typeof fieldValue === 'number') {
        return fieldValue < conditionValue
      }
      return false
    },

    /**
     * Checks if field value is less than or equal to condition value
     * For arrays, checks if any element is less than or equal to condition value
     */
    $lte: (fieldValue, conditionValue) => {
      if (typeof conditionValue !== 'number') return false
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((value) => typeof value === 'number' && value <= conditionValue)
      }
      if (typeof fieldValue === 'number') {
        return fieldValue <= conditionValue
      }
      return false
    },

    /**
     * Checks if field value is in the condition array
     * For arrays, checks if any element is in the condition array
     */
    $in: (fieldValue, conditionValue) => {
      if (!Array.isArray(conditionValue)) return false
      if (Array.isArray(fieldValue)) {
        return fieldValue.some((value) => conditionValue.includes(value))
      }
      return conditionValue.includes(fieldValue)
    },

    /**
     * Checks if field value is not in the condition array
     * For arrays, checks if no element is in the condition array
     */
    $nin: (fieldValue, conditionValue) => {
      if (!Array.isArray(conditionValue)) return false
      if (Array.isArray(fieldValue)) {
        return fieldValue.every((value) => !conditionValue.includes(value))
      }
      return !conditionValue.includes(fieldValue)
    },
  }
}
