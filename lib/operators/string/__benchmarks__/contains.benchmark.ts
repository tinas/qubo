import { Benchmark, runBenchmarkSuite } from '../../../../tools/benchmark';
import { ContainsOperator } from '../contains.operator';

async function runBenchmarks() {
  const operator = new ContainsOperator();

  // Short string tests
  await runBenchmarkSuite('Short String Tests', {
    'short-string-hit': () => operator.evaluate('hello world', 'lo'),
    'short-string-miss': () => operator.evaluate('hello world', 'xyz'),
    'short-string-cached': () => {
      // Same value multiple times to test caching
      operator.evaluate('hello world', 'lo');
      operator.evaluate('hello world', 'lo');
      return operator.evaluate('hello world', 'lo');
    }
  }, { operations: 100000 });

  // Long string tests
  const longString = 'a'.repeat(10000);
  const longPattern = 'a'.repeat(100);
  
  await runBenchmarkSuite('Long String Tests', {
    'long-string-hit': () => operator.evaluate(longString, longPattern),
    'long-string-miss': () => operator.evaluate(longString, 'z'.repeat(100)),
    'long-string-cached': () => {
      operator.evaluate(longString, longPattern);
      operator.evaluate(longString, longPattern);
      return operator.evaluate(longString, longPattern);
    }
  }, { operations: 100000 });
}

runBenchmarks().catch(console.error); 