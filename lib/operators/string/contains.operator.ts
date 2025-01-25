import type { IStringOperator } from '../../operator.types';
import { BaseOperator } from '../base.operator';

export class ContainsOperator extends BaseOperator<string, string> implements IStringOperator {
  protected evaluateInternal(value: string, targetValue: string): boolean {
    // Type check is faster than typeof for hot paths
    if (!value || !targetValue) return false;
    if (Object.prototype.toString.call(value) !== '[object String]') return false;
    
    // For very short strings, indexOf might be faster
    if (targetValue.length <= 3) {
      return value.indexOf(targetValue) !== -1;
    }
    
    return value.includes(targetValue);
  }

  protected getCacheKey(value: string, targetValue: string): string {
    // For strings, we can use a simple concatenation
    // Add length to handle empty strings correctly
    return `${value.length}:${value}-${targetValue.length}:${targetValue}`;
  }
} 