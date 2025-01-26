/**
 * Custom error class for Qubo-specific errors
 * All error messages are prefixed with '[qubo]' for easier identification
 */
export class QuboError extends Error {
  constructor(message: string) {
    super(`[qubo] ${message}`);
    this.name = 'QuboError';
  }
} 