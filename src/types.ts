export type Query = Record<string, unknown>

export interface OperatorContext {
  readonly root: unknown
  match: (value: unknown, query: Query) => boolean
  resolve: (value: unknown, path: string) => unknown
}

/**
 * @param value - resolved field value, or the current document for root-level operators
 * @param operand - the value written next to the operator in the query
 * @param context - engine entry points for operators that recurse into sub-queries
 */
export type OperatorFn = (value: unknown, operand: unknown, context: OperatorContext) => boolean

export interface QuboOptions {
  operators?: Record<`$${string}`, OperatorFn>
}

export interface Qubo {
  evaluate: (document: unknown, query: Query) => boolean
  compile: (query: Query) => (document: unknown) => boolean
  find: <T>(data: readonly T[], query: Query) => T[]
  findOne: <T>(data: readonly T[], query: Query) => T | undefined
}
