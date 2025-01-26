import { type Qubo, type QuboOptions, type Query, type OperatorFunction } from './types';
import * as comparisonOperators from './operators/comparison';
import * as logicalOperators from './operators/logical';
import * as arrayOperators from './operators/array';
import { createTypeError } from './errors';
import { isValidOperatorName, evaluateDocument } from './utils';

/**
 * Creates a new Qubo instance for querying an array of documents
 * @template T The type of documents in the collection
 * @param data The array of documents to query
 * @param options Configuration options for the Qubo instance
 * @returns A Qubo instance with query capabilities
 * @throws {TypeError} If the data is not an array or if there are invalid operators
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
    throw createTypeError('Data must be an array');
  }

  const operators = new Map<string, OperatorFunction>();

  // Register built-in operators
  const builtInOperators = {
    ...comparisonOperators,
    ...logicalOperators,
    ...arrayOperators,
  };

  Object.entries(builtInOperators).forEach(([name, fn]) => {
    if (!isValidOperatorName(name)) {
      throw createTypeError(`Invalid operator name: ${name}. Operator names must start with '$'`);
    }
    operators.set(name, fn);
  });

  // Register custom operators
  if (options.operators) {
    Object.entries(options.operators).forEach(([name, fn]) => {
      if (!isValidOperatorName(name)) {
        throw createTypeError(`Invalid operator name: ${name}. Operator names must start with '$'`);
      }
      operators.set(name, fn);
    });
  }

  return {
    find: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw createTypeError('Query must be an object');
      }
      return data.filter(doc => evaluateDocument(doc, query, operators));
    },
    
    findOne: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw createTypeError('Query must be an object');
      }
      return data.find(doc => evaluateDocument(doc, query, operators)) || null;
    },
    
    evaluate: (query: Query) => {
      if (!query || typeof query !== 'object') {
        throw createTypeError('Query must be an object');
      }
      return data.some(doc => evaluateDocument(doc, query, operators));
    },

    registerOperator: (name: string, fn: OperatorFunction) => {
      if (!isValidOperatorName(name)) {
        throw createTypeError(`Invalid operator name: ${name}. Operator names must start with '$'`);
      }
      operators.set(name, fn);
    },
  };
}
