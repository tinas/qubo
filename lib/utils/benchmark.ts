export interface BenchmarkResult {
  operationCount: number;
  totalTime: number;
  averageTime: number;
  operationsPerSecond: number;
  memoryUsed?: number;
}

export interface BenchmarkOptions {
  iterations?: number;
  warmupIterations?: number;
  measureMemory?: boolean;
}

export class Benchmark {
  constructor(private options: BenchmarkOptions = {}) {
    this.options = {
      iterations: 1000,
      warmupIterations: 100,
      measureMemory: false,
      ...options
    };
  }

  async measure(name: string, fn: () => any): Promise<BenchmarkResult> {
    // Warmup phase
    for (let i = 0; i < this.options.warmupIterations!; i++) {
      await fn();
    }

    // Clear garbage before measurement
    if (global.gc) {
      global.gc();
    }

    const startMemory = this.options.measureMemory ? process.memoryUsage().heapUsed : 0;
    const startTime = performance.now();

    // Measurement phase
    for (let i = 0; i < this.options.iterations!; i++) {
      await fn();
    }

    const endTime = performance.now();
    const endMemory = this.options.measureMemory ? process.memoryUsage().heapUsed : 0;

    const totalTime = endTime - startTime;
    const result: BenchmarkResult = {
      operationCount: this.options.iterations!,
      totalTime,
      averageTime: totalTime / this.options.iterations!,
      operationsPerSecond: (this.options.iterations! / totalTime) * 1000
    };

    if (this.options.measureMemory) {
      result.memoryUsed = endMemory - startMemory;
    }

    return result;
  }

  async compare(tests: Record<string, () => any>): Promise<Record<string, BenchmarkResult>> {
    const results: Record<string, BenchmarkResult> = {};
    
    for (const [name, fn] of Object.entries(tests)) {
      results[name] = await this.measure(name, fn);
    }

    return results;
  }

  static formatResult(result: BenchmarkResult): string {
    return [
      `Operations: ${result.operationCount}`,
      `Total time: ${result.totalTime.toFixed(2)}ms`,
      `Average time: ${result.averageTime.toFixed(3)}ms`,
      `Operations/sec: ${result.operationsPerSecond.toFixed(0)}`,
      result.memoryUsed ? `Memory used: ${(result.memoryUsed / 1024 / 1024).toFixed(2)}MB` : null
    ].filter(Boolean).join('\n');
  }
} 