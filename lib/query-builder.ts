import type { IQueryBuilder } from './builder.types';
import type { Query, QueryValue } from './query.types';

export class QueryBuilder<T> implements IQueryBuilder {
  private query: Record<string, any> = {};

  public build(): Query<T> {
    return this.query as Query<T>;
  }

  public eq(field: string, value: QueryValue): this {
    this.query[field] = { $eq: value };
    return this;
  }

  public gt(field: string, value: number | Date): this {
    this.query[field] = { $gt: value };
    return this;
  }

  public gte(field: string, value: number | Date): this {
    this.query[field] = { $gte: value };
    return this;
  }

  public lt(field: string, value: number | Date): this {
    this.query[field] = { $lt: value };
    return this;
  }

  public lte(field: string, value: number | Date): this {
    this.query[field] = { $lte: value };
    return this;
  }

  public ne(field: string, value: QueryValue): this {
    this.query[field] = { $ne: value };
    return this;
  }

  public in(field: string, values: QueryValue[]): this {
    this.query[field] = { $in: values };
    return this;
  }

  public nin(field: string, values: QueryValue[]): this {
    this.query[field] = { $nin: values };
    return this;
  }

  public and(queries: Query<T>[]): this {
    this.query = { $and: queries };
    return this;
  }

  public or(queries: Query<T>[]): this {
    this.query = { $or: queries };
    return this;
  }

  public not(query: Query<T>): this {
    this.query = { $not: [query] };
    return this;
  }
} 