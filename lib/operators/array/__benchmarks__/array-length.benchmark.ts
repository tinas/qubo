import { Benchmark, runBenchmarkSuite } from '../../../../tools/benchmark';
import { ArrayLengthOperator } from '../array-length.operator';

async function runBenchmarks() {
  const operator = new ArrayLengthOperator();

  // Small array tests
  await runBenchmarkSuite('Small Array Tests', {
    'small-array-hit': () => operator.evaluate([1, 2, 3], 3),
    'small-array-miss': () => operator.evaluate([1, 2], 3),
    'small-array-cached': () => {
      // Same value multiple times to test caching
      operator.evaluate([1, 2, 3], 3);
      operator.evaluate([1, 2, 3], 3);
      return operator.evaluate([1, 2, 3], 3);
    }
  }, { operations: 100000 });

  // Large array tests
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);
  await runBenchmarkSuite('Large Array Tests', {
    'large-array-hit': () => operator.evaluate(largeArray, 10000),
    'large-array-miss': () => operator.evaluate(largeArray, 9999),
    'large-array-cached': () => {
      operator.evaluate(largeArray, 10000);
      operator.evaluate(largeArray, 10000);
      return operator.evaluate(largeArray, 10000);
    }
  }, { operations: 100000 });

  // Invalid input tests
  await runBenchmarkSuite('Invalid Input Tests', {
    'null-input': () => operator.evaluate(null as any, 3),
    'undefined-input': () => operator.evaluate(undefined as any, 3),
    'non-array-input': () => operator.evaluate('not an array' as any, 3)
  }, { operations: 100000 });
}

runBenchmarks().catch(console.error); 