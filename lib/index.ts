import { Query, QuboStore, QuboOptions } from './types';
import { evaluateQuery } from './evaluator';
import { registerOperators } from './operators';

export function createQubo<T>(data: T[], options: QuboOptions = {}): QuboStore<T> {
  // Register custom operators if provided
  if (options.operators) {
    registerOperators(options.operators);
  }

  return {
    data,
    find(query: Query<T>) {
      return data.filter(doc => evaluateQuery(doc, query));
    },
    findOne(query: Query<T>) {
      return data.find(doc => evaluateQuery(doc, query)) || null;
    },
    evaluate(doc: T, query: Query<T>) {
      return evaluateQuery(doc, query);
    },
  };
}

// Re-export types
export * from './types'; 