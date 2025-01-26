/**
 * Creates a Qubo error with a custom message
 * @param message The error message
 */
export function createError(message: string): Error {
  return new Error(`[qubo] ${message}`);
}

/**
 * Creates a Qubo type error with a custom message
 * @param message The error message
 */
export function createTypeError(message: string): TypeError {
  return new TypeError(`[qubo] ${message}`);
} 