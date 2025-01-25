import { Benchmark, runBenchmarkSuite } from '../../../utils/benchmark';
import { DateWithinOperator } from '../date-within.operator';

async function runBenchmarks() {
  const operator = new DateWithinOperator();
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Recent dates tests
  await runBenchmarkSuite('Recent Dates Tests', {
    'within-one-day': () => operator.evaluate(yesterday, { days: 1 }),
    'within-one-week': () => operator.evaluate(lastWeek, { days: 7 }),
    'outside-range': () => operator.evaluate(lastWeek, { days: 1 })
  }, { operations: 100000 });

  // Edge cases tests
  await runBenchmarkSuite('Edge Cases Tests', {
    'same-day': () => operator.evaluate(now, { days: 1 }),
    'exact-boundary': () => operator.evaluate(lastWeek, { days: 7 }),
    'invalid-date': () => operator.evaluate(new Date('invalid'), { days: 1 })
  }, { operations: 100000 });

  // Caching tests
  await runBenchmarkSuite('Caching Tests', {
    'uncached-call': () => operator.evaluate(now, { days: 1 }),
    'cached-call': () => {
      // Same value multiple times to test caching
      operator.evaluate(now, { days: 1 });
      operator.evaluate(now, { days: 1 });
      return operator.evaluate(now, { days: 1 });
    },
    'different-dates': () => {
      operator.evaluate(now, { days: 1 });
      operator.evaluate(yesterday, { days: 1 });
      return operator.evaluate(lastWeek, { days: 1 });
    }
  }, { operations: 100000 });
}

runBenchmarks().catch(console.error); 