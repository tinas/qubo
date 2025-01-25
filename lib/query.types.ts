import type { ComparisonOperator, LogicalOperator } from './operator.types';

export type QueryValue = string | number | boolean | Date | Record<string, unknown> | Array<string | number | boolean | Date | null> | null | undefined;

export type ComparisonExpression = {
  $eq?: QueryValue;
  $gt?: number | Date;
  $gte?: number | Date;
  $lt?: number | Date;
  $lte?: number | Date;
  $ne?: QueryValue;
  $in?: QueryValue[];
  $nin?: QueryValue[];
};

export type LogicalExpression<T> = {
  [key in LogicalOperator]?: Query<T>[];
};

export type FieldQuery = ComparisonExpression | QueryValue;

export type Query<T> = {
  [P in keyof T | string]?: FieldQuery | Query<T>[];
} & LogicalExpression<T>; 