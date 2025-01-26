import { type Qubo, type QuboOptions, type Query, type OperatorFunction } from './types';
import * as comparisonOperators from './operators/comparison';
import * as logicalOperators from './operators/logical';
import * as arrayOperators from './operators/array';
import { QuboError } from './errors';

/**
 * Validates an operator's name
 * @param name The operator name to validate
 * @throws {QuboError} If the operator name is invalid
 */
function validateOperatorName(name: string) {
  if (!name.startsWith('$')) {
    throw new QuboError(`Invalid operator name: ${name}. Operator names must start with '$'`);
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

  const operators = new Map<string, OperatorFunction>();

  // Register built-in operators
  const builtInOperators = {
    ...comparisonOperators,
    ...logicalOperators,
    ...arrayOperators,
  };

  Object.entries(builtInOperators).forEach(([name, fn]) => {
    validateOperatorName(name);
    operators.set(name, fn);
  });

  // Register custom operators
  if (options.operators) {
    Object.entries(options.operators).forEach(([name, fn]) => {
      validateOperatorName(name);
      operators.set(name, fn);
    });
  }

  function evaluateValue(value: unknown, query: unknown): boolean {
    if (typeof query === 'object' && query !== null) {
      const entries = Object.entries(query as Record<string, unknown>);
      
      return entries.every(([key, subQuery]) => {
        if (key.startsWith('$')) {
          const operatorFn = operators.get(key);
          if (!operatorFn) {
            throw new QuboError(`Unknown operator: ${key}`);
          }
          return operatorFn(value, subQuery, (v, q) => evaluateValue(v, q));
        }
        
        // Handle dot notation and array indices
        const subValue = key.includes('.') || key.includes('[') 
          ? resolvePath(value, key)
          : (value as Record<string, unknown>)?.[key];

        return evaluateValue(subValue, subQuery);
      });
    }

    return value === query;
  }

  function evaluateDocument(doc: T, query: Query): boolean {
    return Object.entries(query).every(([key, value]) => {
      if (key === '$elemMatch' && Array.isArray(doc)) {
        return doc.some(item => evaluateDocument(item, value as Query));
      }

      if (key.startsWith('$')) {
        const operatorFn = operators.get(key);
        if (!operatorFn) {
          throw new QuboError(`Unknown operator: ${key}`);
        }
        return operatorFn(doc, value, (v, q) => evaluateDocument(v as T, q as Query));
      }

      // Handle dot notation and array indices
      const docValue = key.includes('.') || key.includes('[')
        ? resolvePath(doc, key)
        : (doc as Record<string, unknown>)?.[key];

      return evaluateValue(docValue, value);
    });
  }

  return {
    find: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw new QuboError('Query must be an object');
      }
      return data.filter(doc => evaluateDocument(doc, query));
    },
    
    findOne: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw new QuboError('Query must be an object');
      }
      return data.find(doc => evaluateDocument(doc, query)) || null;
    },
    
    evaluate: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw new QuboError('Query must be an object');
      }
      return data.some(doc => evaluateDocument(doc, query));
    },

    registerOperator: (name: string, fn: OperatorFunction) => {
      validateOperatorName(name);
      operators.set(name, fn);
    },
  };
}
