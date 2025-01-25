import { Benchmark } from '../../../utils/benchmark';
import { ArrayLengthOperator } from '../array-length.operator';

async function runBenchmarks() {
  const benchmark = new Benchmark({ iterations: 100000, measureMemory: true });
  const operator = new ArrayLengthOperator();

  // Small array test
  const smallArray = Array.from({ length: 10 }, (_, i) => i);
  
  const smallResults = await benchmark.compare({
    'small-array-hit': () => operator.evaluate(smallArray, 10),
    'small-array-miss': () => operator.evaluate(smallArray, 20),
    'small-array-cached': () => {
      operator.evaluate(smallArray, 10);
      operator.evaluate(smallArray, 10);
      return operator.evaluate(smallArray, 10);
    }
  });

  console.log('Small Array Tests:');
  Object.entries(smallResults).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log(Benchmark.formatResult(result));
  });

  // Large array test
  const largeArray = Array.from({ length: 10000 }, (_, i) => i);
  
  const largeResults = await benchmark.compare({
    'large-array-hit': () => operator.evaluate(largeArray, 10000),
    'large-array-miss': () => operator.evaluate(largeArray, 20000),
    'large-array-cached': () => {
      operator.evaluate(largeArray, 10000);
      operator.evaluate(largeArray, 10000);
      return operator.evaluate(largeArray, 10000);
    }
  });

  console.log('\nLarge Array Tests:');
  Object.entries(largeResults).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log(Benchmark.formatResult(result));
  });

  // Invalid input test
  const invalidResults = await benchmark.compare({
    'null-input': () => operator.evaluate(null as any, 0),
    'undefined-input': () => operator.evaluate(undefined as any, 0),
    'non-array-input': () => operator.evaluate({} as any, 0)
  });

  console.log('\nInvalid Input Tests:');
  Object.entries(invalidResults).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log(Benchmark.formatResult(result));
  });
}

runBenchmarks().catch(console.error); 