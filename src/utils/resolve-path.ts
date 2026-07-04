function resolveSegments(value: unknown, segments: string[], index: number): unknown {
  if (index >= segments.length) return value
  if (value == null) return undefined

  // Arrays fan out: 'instock.qty' over [{ qty: 5 }, { qty: 15 }] resolves to [5, 15].
  if (Array.isArray(value)) {
    return value.map(element => resolveSegments(element, segments, index)).flat(Infinity)
  }

  if (typeof value === 'object') {
    return resolveSegments((value as Record<string, unknown>)[segments[index]], segments, index + 1)
  }

  return undefined
}

export function resolvePath(value: unknown, path: string): unknown {
  if (!path) return value
  return resolveSegments(value, path.split('.'), 0)
}
