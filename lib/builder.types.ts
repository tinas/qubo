import type { Query, QueryValue } from './query.types';

export interface IQueryBuilder {
  build(): Query<any>;
  eq(field: string, value: QueryValue): this;
  gt(field: string, value: number | Date): this;
  gte(field: string, value: number | Date): this;
  lt(field: string, value: number | Date): this;
  lte(field: string, value: number | Date): this;
  ne(field: string, value: QueryValue): this;
  in(field: string, values: QueryValue[]): this;
  nin(field: string, values: QueryValue[]): this;
  and(queries: Query<any>[]): this;
  or(queries: Query<any>[]): this;
  not(query: Query<any>): this;
} 