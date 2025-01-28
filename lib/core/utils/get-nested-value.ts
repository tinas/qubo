/**
 * Recursively retrieves a nested value from an object using an array of keys
 * @param obj Any value (array, object, primitive, null...)
 * @param keys Array of strings representing the path (e.g., ["instock", "qty"])
 * @param index Current position in the keys array
 * @returns The nested value if found, undefined otherwise
 *
 * Purpose: To traverse deeply nested arrays (e.g., [[...], [...]])
 * and objects to find the target value
 */
function getNestedValueRecursive(object: unknown, keys: string[], index: number): unknown {
  if (object == undefined) return undefined;

  // All keys processed => return the final value
  if (index >= keys.length) {
    return object;
  }

  // If obj is an array, make recursive calls for each element
  if (Array.isArray(object)) {
    // Apply the current key (keys[index]) to each element
    const results: unknown[] = [];
    for (const element of object) {
      results.push(getNestedValueRecursive(element, keys, index));
    }

    // results might still be array of arrays => flatten it
    // using flat(Infinity) or your own flatten function
    return results.flat(Infinity);
  }

  // If obj is an object => proceed to obj[keys[index]]
  if (typeof object === 'object') {
    const nextKey = keys[index];
    const nextValue = (object as Record<string, unknown>)[nextKey];
    // Move to next key => index+1
    return getNestedValueRecursive(nextValue, keys, index + 1);
  }

  // If obj is a primitive and there are more keys => cannot proceed
  return undefined;
}

/**
 * Gets a nested value from an object using dot notation
 * @param obj The document/object to query
 * @param path A dot-notation path like "instock.qty"
 * @returns The value at the specified path, or undefined if not found
 */
export function getNestedValue(object: unknown, path: string): unknown {
  if (!path) return object;
  const keys = path.split('.');
  return getNestedValueRecursive(object, keys, 0);
}
