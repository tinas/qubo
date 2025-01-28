/** Prefix used for all qubo-related errors */
const ERROR_PREFIX = '[qubo]';

/**
 * Creates and throws a new Error with the qubo prefix
 * @param message The error message
 * @throws {Error} Always throws an error with the prefixed message
 */
export function createError(message: string): Error {
  throw new Error(`${ERROR_PREFIX} ${message}`);
}

/**
 * Creates and throws a new TypeError with the qubo prefix
 * @param message The type error message
 * @throws {TypeError} Always throws a type error with the prefixed message
 */
export function createTypeError(message: string): TypeError {
  throw new TypeError(`${ERROR_PREFIX} ${message}`);
}
