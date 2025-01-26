import { type Operator, type CustomOperator } from './types';
import { QuboError } from './errors';

/**
 * Gets an operator function that can handle both built-in and custom operators
 */
export function getOperatorFunction(
  operators: Map<string, Operator | CustomOperator>,
  operatorName: string
): (value: unknown, operand: unknown, evaluateFunction?: (value: unknown, query: Record<string, unknown>) => boolean) => boolean {
  const operator = operators.get(operatorName);
  if (!operator) {
    throw new QuboError(`Unknown operator: ${operatorName}`);
  }

  // Check if it's a built-in operator
  if ('evaluateFunction' in (operator as Operator).fn) {
    return (value, operand, evaluateFunction) => {
      if (!evaluateFunction) {
        throw new QuboError('Evaluate function is required for built-in operators');
      }
      return (operator as Operator).fn(value, operand, evaluateFunction);
    };
  }

  // It's a custom operator
  return (value, operand) => (operator as CustomOperator).fn(value, operand);
}

/**
 * Evaluates a value using an operator
 * @param value The value to evaluate
 * @param query The query object containing the operator
 * @param evaluateFunction Function to evaluate nested queries
 * @param operators Map of available operators
 * @returns The result of the evaluation
 */
export function evaluateWithOperator(
  value: unknown,
  query: Record<string, unknown>,
  evaluateFunction: (value: unknown, query: Record<string, unknown>) => boolean,
  operators: Map<string, Operator | CustomOperator>
): boolean {
  const operator = Object.keys(query)[0];
  const operand = query[operator];
  const operatorFn = getOperatorFunction(operators, operator);
  return operatorFn(value, operand, evaluateFunction);
} 