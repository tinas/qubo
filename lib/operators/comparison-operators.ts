import { EqualOperator } from './comparison/equal.operator';
import { GreaterThanEqualOperator } from './comparison/greater-than-equal.operator';
import { GreaterThanOperator } from './comparison/greater-than.operator';
import { InOperator } from './comparison/in.operator';
import { LessThanEqualOperator } from './comparison/less-than-equal.operator';
import { LessThanOperator } from './comparison/less-than.operator';
import { NotEqualOperator } from './comparison/not-equal.operator';
import { NotInOperator } from './comparison/not-in.operator';

export const comparisonOperators = {
  $eq: EqualOperator,
  $ne: NotEqualOperator,
  $gt: GreaterThanOperator,
  $gte: GreaterThanEqualOperator,
  $lt: LessThanOperator,
  $lte: LessThanEqualOperator,
  $in: InOperator,
  $nin: NotInOperator,
};
