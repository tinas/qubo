import type { Query } from './query.types';

export interface IQueryBuilder<T> {
  build(): Query<T>;
  field(name: keyof T | string): this;
  value(value: T[keyof T]): this;
  and(queries: Query<T>[]): this;
  or(queries: Query<T>[]): this;
  not(query: Query<T>): this;
} 