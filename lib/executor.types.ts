import type { Query } from './query.types';

export interface IQueryExecutor<T> {
  find(query: Query<T>): T[];
  findOne(query: Query<T>): T | null;
} 