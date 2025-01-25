import type { ComparisonOperator, LogicalOperator } from './operator.types';

export type QueryValue = string | number | boolean | Date | Array<any> | null;

export type ComparisonExpression = {
  [key in ComparisonOperator]?: QueryValue;
};

export type LogicalExpression<T> = {
  [key in LogicalOperator]?: Query<T>[];
};

export type FieldQuery = ComparisonExpression | QueryValue;

export type Query<T> = {
  [P in keyof T | string]?: FieldQuery | Query<T>[];
} & {
  [key in LogicalOperator]?: Query<T>[];
}; 