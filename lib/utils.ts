import { type OperatorFunction, type Query } from './types';
import { createError } from './errors';

/**
 * Checks if the given string is a valid operator name
 * @param name The operator name to check
 * @returns True if the name is a valid operator name, false otherwise
 */
export function isValidOperatorName(name: string): boolean {
  return name.startsWith('$');
}

/**
 * Resolves a path with dot notation and array indices to a value
 * @param obj The object to traverse
 * @param path The path with dot notation (e.g. 'a.b[0].c')
 * @returns The value at the path or undefined if not found
 */
export function resolvePath(obj: unknown, path: string): unknown {
  if (!path) return undefined;
  
  // Handle escaped dots by temporarily replacing them
  const escapedPath = path.replace(/\\\./g, '\u0000');
  const parts = escapedPath.match(/[^\.\[\]]+|\[\d+\]/g) || [];
  let current: unknown = obj;

  for (const part of parts) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    if (part.startsWith('[') && part.endsWith(']')) {
      const index = parseInt(part.slice(1, -1));
      if (Array.isArray(current)) {
        current = current[index];
      } else {
        return undefined;
      }
    } else {
      // Restore escaped dots
      const key = part.replace(/\u0000/g, '.');
      current = (current as Record<string, unknown>)[key];
    }
  }

  return current;
}

/**
 * Evaluates if a value matches a query
 * @param value The value to evaluate
 * @param query The query to match against
 * @param operators Map of available operators
 * @returns True if the value matches the query, false otherwise
 */
export function evaluateValue(value: unknown, query: unknown, operators: Map<string, OperatorFunction>): boolean {
  if (typeof query === 'object' && query !== null) {
    const entries = Object.entries(query as Record<string, unknown>);
    
    return entries.every(([key, subQuery]) => {
      if (key.startsWith('$')) {
        const operatorFn = operators.get(key);
        if (!operatorFn) {
          throw createError(`Unknown operator: ${key}`);
        }
        return operatorFn(value, subQuery, (v, q) => evaluateValue(v, q, operators));
      }
      
      // Handle dot notation and array indices
      const subValue = key.includes('.') || key.includes('[') 
        ? resolvePath(value, key)
        : (value as Record<string, unknown>)?.[key];

      return evaluateValue(subValue, subQuery, operators);
    });
  }

  return value === query;
}

/**
 * Evaluates if a document matches a query
 * @param doc The document to evaluate
 * @param query The query to match against
 * @param operators Map of available operators
 * @returns True if the document matches the query, false otherwise
 */
export function evaluateDocument(doc: unknown, query: Query, operators: Map<string, OperatorFunction>): boolean {
  return Object.entries(query).every(([key, value]) => {
    if (key === '$elemMatch' && Array.isArray(doc)) {
      return doc.some(item => evaluateDocument(item, value as Query, operators));
    }

    if (key.startsWith('$')) {
      const operatorFn = operators.get(key);
      if (!operatorFn) {
        throw createError(`Unknown operator: ${key}`);
      }
      return operatorFn(doc, value, (v, q) => evaluateDocument(v, q as Query, operators));
    }

    // Handle dot notation and array indices
    const docValue = key.includes('.') || key.includes('[')
      ? resolvePath(doc, key)
      : (doc as Record<string, unknown>)?.[key];

    return evaluateValue(docValue, value, operators);
  });
} 