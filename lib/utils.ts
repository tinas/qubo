import { Operator } from './types';
import { QuboError } from './errors';

/**
 * Evaluates a value using an operator
 * @param value The value to evaluate
 * @param operator The operator name
 * @param operand The operand to evaluate against
 * @param operators Map of available operators
 * @param evaluateFn Function to evaluate nested queries
 * @returns The result of the evaluation
 */
export function evaluateWithOperator(
  value: unknown,
  operator: string,
  operand: unknown,
  operators: Map<string, Operator>,
  evaluateFn: (value: unknown, query: unknown) => boolean
): boolean {
  const operatorFn = getOperator(operators, operator);
  return operatorFn.fn(value, operand, evaluateFn);
}

function getOperator(operators: Map<string, Operator>, operatorName: string): Operator {
  const operator = operators.get(operatorName);
  if (!operator) {
    throw new QuboError(`Unknown operator: ${operatorName}`);
  }
  return operator;
} 