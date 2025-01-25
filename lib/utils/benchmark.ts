interface BenchmarkResult {
  operations: number;
  totalTime: number;
  averageTime: number;
  operationsPerSecond: number;
  memoryUsed: number;
}

interface BenchmarkOptions {
  operations?: number;
  warmup?: number;
  gc?: boolean;
}

export class Benchmark {
  private readonly operations: number;
  private readonly warmup: number;
  private readonly gc: boolean;

  constructor(options: BenchmarkOptions = {}) {
    this.operations = options.operations ?? 1e5;
    this.warmup = options.warmup ?? 1e3;
    this.gc = options.gc ?? true;
  }

  async run(testFunction: () => unknown): Promise<BenchmarkResult> {
    // Warmup
    for (let index = 0; index < this.warmup; index++) {
      testFunction();
    }

    // Force garbage collection if available
    if (this.gc && globalThis.gc) {
      globalThis.gc();
    }

    const startMemory = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    // Run the test
    for (let index = 0; index < this.operations; index++) {
      testFunction();
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    const totalTime = endTime - startTime;
    const averageTime = totalTime / this.operations;
    const operationsPerSecond = Math.floor((this.operations / totalTime) * 1000);
    const memoryUsed = (endMemory - startMemory) / (1024 * 1024); // Convert to MB

    return {
      operations: this.operations,
      totalTime,
      averageTime,
      operationsPerSecond,
      memoryUsed,
    };
  }
}

export function printBenchmarkResult(name: string, result: BenchmarkResult): void {
  console.log(`\n${name}:`);
  console.log(`Operations: ${result.operations}`);
  console.log(`Total time: ${result.totalTime.toFixed(2)}ms`);
  console.log(`Average time: ${result.averageTime.toFixed(3)}ms`);
  console.log(`Operations/sec: ${result.operationsPerSecond}`);
  console.log(`Memory used: ${result.memoryUsed.toFixed(2)}MB`);
}

export async function runBenchmarkSuite(
  name: string,
  tests: Record<string, () => unknown>,
  options: BenchmarkOptions = {},
): Promise<void> {
  console.log(`\n${name}:\n`);
  const benchmark = new Benchmark(options);

  for (const [testName, testFunction] of Object.entries(tests)) {
    const result = await benchmark.run(testFunction);
    printBenchmarkResult(testName, result);
  }
}
