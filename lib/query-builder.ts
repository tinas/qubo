import type { IQueryBuilder } from './builder.types';
import type { Query, QueryValue, FieldQuery } from './query.types';

export class QueryBuilder<T> implements IQueryBuilder<T> {
  private query: Query<T> = {};
  private currentField?: string;

  public build(): Query<T> {
    return this.query;
  }

  public field(name: keyof T | string): this {
    this.currentField = name as string;
    return this;
  }

  public value(value: T[keyof T]): this {
    if (!this.currentField) {
      throw new Error('Field must be set before value');
    }
    (this.query as Record<string, FieldQuery>)[this.currentField] = value as QueryValue;
    return this;
  }

  public eq(field: string, value: QueryValue): this {
    (this.query as Record<string, FieldQuery>)[field] = { $eq: value };
    return this;
  }

  public gt(field: string, value: number | Date): this {
    (this.query as Record<string, FieldQuery>)[field] = { $gt: value };
    return this;
  }

  public gte(field: string, value: number | Date): this {
    (this.query as Record<string, FieldQuery>)[field] = { $gte: value };
    return this;
  }

  public lt(field: string, value: number | Date): this {
    (this.query as Record<string, FieldQuery>)[field] = { $lt: value };
    return this;
  }

  public lte(field: string, value: number | Date): this {
    (this.query as Record<string, FieldQuery>)[field] = { $lte: value };
    return this;
  }

  public ne(field: string, value: QueryValue): this {
    (this.query as Record<string, FieldQuery>)[field] = { $ne: value };
    return this;
  }

  public in(field: string, values: QueryValue[]): this {
    (this.query as Record<string, FieldQuery>)[field] = { $in: values };
    return this;
  }

  public nin(field: string, values: QueryValue[]): this {
    (this.query as Record<string, FieldQuery>)[field] = { $nin: values };
    return this;
  }

  public and(queries: Query<T>[]): this {
    this.query.$and = queries;
    return this;
  }

  public or(queries: Query<T>[]): this {
    this.query.$or = queries;
    return this;
  }

  public not(query: Query<T>): this {
    this.query.$not = [query];
    return this;
  }
} 