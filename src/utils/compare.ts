/**
 * Three-way comparison for orderable values (numbers, bigints, strings and
 * dates). Returns a negative/zero/positive number, or `undefined` when the
 * two values are not of the same orderable type.
 */
export function compare(a: unknown, b: unknown): number | undefined {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'bigint' && typeof b === 'bigint') return a < b ? -1 : a > b ? 1 : 0
  if (typeof a === 'string' && typeof b === 'string') return a < b ? -1 : a > b ? 1 : 0
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  return undefined
}
