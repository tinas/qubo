import { Benchmark } from '../../../utils/benchmark';
import { ContainsOperator } from '../contains.operator';

async function runBenchmarks() {
  const benchmark = new Benchmark({ iterations: 100000, measureMemory: true });
  const operator = new ContainsOperator();

  // Short string test
  const shortResults = await benchmark.compare({
    'short-string-hit': () => operator.evaluate('hello world', 'lo'),
    'short-string-miss': () => operator.evaluate('hello world', 'xyz'),
    'short-string-cached': () => {
      // Same value multiple times to test caching
      operator.evaluate('hello world', 'lo');
      operator.evaluate('hello world', 'lo');
      return operator.evaluate('hello world', 'lo');
    }
  });

  console.log('Short String Tests:');
  Object.entries(shortResults).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log(Benchmark.formatResult(result));
  });

  // Long string test
  const longString = 'a'.repeat(10000);
  const longPattern = 'a'.repeat(100);
  
  const longResults = await benchmark.compare({
    'long-string-hit': () => operator.evaluate(longString, longPattern),
    'long-string-miss': () => operator.evaluate(longString, 'z'.repeat(100)),
    'long-string-cached': () => {
      operator.evaluate(longString, longPattern);
      operator.evaluate(longString, longPattern);
      return operator.evaluate(longString, longPattern);
    }
  });

  console.log('\nLong String Tests:');
  Object.entries(longResults).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log(Benchmark.formatResult(result));
  });
}

runBenchmarks().catch(console.error); 