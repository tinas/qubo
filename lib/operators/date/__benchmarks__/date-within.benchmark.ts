import { Benchmark } from '../../../utils/benchmark';
import { DateWithinOperator } from '../date-within.operator';

async function runBenchmarks() {
  const benchmark = new Benchmark({ iterations: 100000, measureMemory: true });
  const operator = new DateWithinOperator();

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Recent dates test
  const recentResults = await benchmark.compare({
    'within-one-day': () => operator.evaluate(yesterday, { days: 1 }),
    'within-week': () => operator.evaluate(lastWeek, { days: 7 }),
    'outside-range': () => operator.evaluate(lastMonth, { days: 7 }),
    'cached-result': () => {
      operator.evaluate(yesterday, { days: 1 });
      operator.evaluate(yesterday, { days: 1 });
      return operator.evaluate(yesterday, { days: 1 });
    }
  });

  console.log('Recent Dates Tests:');
  Object.entries(recentResults).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log(Benchmark.formatResult(result));
  });

  // Edge cases test
  const edgeResults = await benchmark.compare({
    'same-day': () => operator.evaluate(now, { days: 0 }),
    'negative-days': () => operator.evaluate(now, { days: -1 }),
    'invalid-date': () => operator.evaluate(new Date('invalid'), { days: 1 }),
    'null-input': () => operator.evaluate(null as any, { days: 1 })
  });

  console.log('\nEdge Cases Tests:');
  Object.entries(edgeResults).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log(Benchmark.formatResult(result));
  });

  // Cache effectiveness test
  const cacheResults = await benchmark.compare({
    'repeated-same-value': () => {
      for (let i = 0; i < 10; i++) {
        operator.evaluate(yesterday, { days: 1 });
      }
    },
    'different-dates-same-range': () => {
      const dates = Array.from({ length: 10 }, (_, i) => 
        new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      );
      for (const date of dates) {
        operator.evaluate(date, { days: 7 });
      }
    }
  });

  console.log('\nCache Effectiveness Tests:');
  Object.entries(cacheResults).forEach(([name, result]) => {
    console.log(`\n${name}:`);
    console.log(Benchmark.formatResult(result));
  });
}

runBenchmarks().catch(console.error); 