import { Qubo, QuboOptions, Query, Operator } from './types';
import * as comparisonOperators from './operators/comparison';
import * as logicalOperators from './operators/logical';
import * as arrayOperators from './operators/array';
import { QuboError } from './errors';
import { evaluateWithOperator } from './utils';

const defaultOperators: Operator[] = [
  ...Object.values(comparisonOperators),
  ...Object.values(logicalOperators),
  ...Object.values(arrayOperators),
];

/**
 * Validates an operator's structure and naming convention
 * @param operator The operator to validate
 * @throws {QuboError} If the operator is invalid
 */
function validateOperator(operator: Operator) {
  if (!operator.name.startsWith('$')) {
    throw new QuboError(`Invalid operator name: ${operator.name}. Operator names must start with '$'`);
  }

  if (typeof operator.fn !== 'function') {
    throw new QuboError(`Invalid operator function for ${operator.name}. Operator must have a valid function`);
  }
}

/**
 * Resolves a path with dot notation and array indices to a value
 * @param obj The object to traverse
 * @param path The path with dot notation (e.g. 'a.b[0].c')
 * @returns The value at the path or undefined if not found
 */
function resolvePath(obj: unknown, path: string): unknown {
  const parts = path.match(/[^\.\[\]]+|\[\d+\]/g) || [];
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
      current = (current as Record<string, unknown>)[part];
    }
  }

  return current;
}

/**
 * Evaluates a value against a query using registered operators
 * @param value The value to evaluate
 * @param query The query to evaluate against
 * @param operators Map of available operators
 * @returns True if the value matches the query, false otherwise
 * @throws {QuboError} If an unknown operator is used
 */
function evaluateValue(value: unknown, query: unknown, operators: Map<string, Operator>): boolean {
  if (typeof query === 'object' && query !== null) {
    const entries = Object.entries(query as Record<string, unknown>);
    
    return entries.every(([key, subQuery]) => {
      if (key.startsWith('$')) {
        return evaluateWithOperator(
          value,
          key,
          subQuery,
          operators,
          (v, q) => evaluateValue(v, q, operators)
        );
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
 * Evaluates a document against a query using registered operators
 * @param doc The document to evaluate
 * @param query The query to evaluate against
 * @param operators Map of available operators
 * @returns True if the document matches the query, false otherwise
 * @throws {QuboError} If an unknown operator is used
 */
function evaluateDocument<T>(doc: T, query: Query, operators: Map<string, Operator>): boolean {
  return Object.entries(query).every(([key, value]) => {
    if (key === '$elemMatch' && Array.isArray(doc)) {
      return doc.some(item => evaluateDocument(item, value as Query, operators));
    }

    if (key.startsWith('$')) {
      return evaluateWithOperator(
        doc,
        key,
        value,
        operators,
        (v, q) => evaluateDocument(v as T, q as Query, operators)
      );
    }

    // Handle dot notation and array indices
    const docValue = key.includes('.') || key.includes('[')
      ? resolvePath(doc, key)
      : (doc as Record<string, unknown>)?.[key];

    return evaluateValue(docValue, value, operators);
  });
}

/**
 * Creates a new Qubo instance for querying an array of documents
 * @template T The type of documents in the collection
 * @param data The array of documents to query
 * @param options Configuration options for the Qubo instance
 * @returns A Qubo instance with query capabilities
 * @throws {QuboError} If the data is not an array or if there are invalid operators
 * 
 * @example
 * ```typescript
 * const data = [
 *   { name: 'John', age: 30 },
 *   { name: 'Jane', age: 25 }
 * ];
 * 
 * const qubo = createQubo(data);
 * const results = qubo.find({ age: { $gt: 25 } });
 * ```
 */
export function createQubo<T>(data: T[], options: QuboOptions = {}): Qubo<T> {
  if (!Array.isArray(data)) {
    throw new QuboError('Data must be an array');
  }

  const operators = new Map<string, Operator>();
  const allOperators = [...defaultOperators, ...(options.operators || [])];
  
  allOperators.forEach(operator => {
    try {
      validateOperator(operator);
      operators.set(operator.name, operator);
    } catch (error: unknown) {
      if (error instanceof QuboError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new QuboError(`Failed to register operator ${operator.name}: ${error.message}`);
      }
      throw new QuboError(`Failed to register operator ${operator.name}: Unknown error`);
    }
  });

  return {
    find: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw new QuboError('Query must be an object');
      }
      return data.filter(doc => evaluateDocument(doc, query, operators));
    },
    
    findOne: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw new QuboError('Query must be an object');
      }
      return data.find(doc => evaluateDocument(doc, query, operators)) || null;
    },
    
    evaluate: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw new QuboError('Query must be an object');
      }
      return data.some(doc => evaluateDocument(doc, query, operators));
    },
  };
}
