import * as qubo from '../index';

describe('Library exports', () => {
  it('should export all types', () => {
    // Type exports
    expect(typeof qubo.QueryBuilder).toBe('function');
    expect(typeof qubo.QueryExecutor).toBe('function');
  });

  it('should export operator maps', () => {
    // Comparison operators
    expect(qubo.comparisonOperators).toBeDefined();
    expect(qubo.comparisonOperators.$eq).toBeDefined();
    expect(qubo.comparisonOperators.$ne).toBeDefined();
    expect(qubo.comparisonOperators.$gt).toBeDefined();
    expect(qubo.comparisonOperators.$gte).toBeDefined();
    expect(qubo.comparisonOperators.$lt).toBeDefined();
    expect(qubo.comparisonOperators.$lte).toBeDefined();
    expect(qubo.comparisonOperators.$in).toBeDefined();
    expect(qubo.comparisonOperators.$nin).toBeDefined();

    // String operators
    expect(qubo.stringOperators).toBeDefined();
    expect(qubo.stringOperators.$contains).toBeDefined();
    expect(qubo.stringOperators.$startsWith).toBeDefined();
    expect(qubo.stringOperators.$endsWith).toBeDefined();
    expect(qubo.stringOperators.$regex).toBeDefined();
    expect(qubo.stringOperators.$length).toBeDefined();

    // Date operators
    expect(qubo.dateOperators).toBeDefined();
    expect(qubo.dateOperators.$after).toBeDefined();
    expect(qubo.dateOperators.$before).toBeDefined();
    expect(qubo.dateOperators.$between).toBeDefined();
    expect(qubo.dateOperators.$within).toBeDefined();
    expect(qubo.dateOperators.$sameDay).toBeDefined();

    // Array operators
    expect(qubo.arrayOperators).toBeDefined();
    expect(qubo.arrayOperators.$length).toBeDefined();
    expect(qubo.arrayOperators.$contains).toBeDefined();
    expect(qubo.arrayOperators.$containsAll).toBeDefined();
    expect(qubo.arrayOperators.$containsAny).toBeDefined();
    expect(qubo.arrayOperators.$empty).toBeDefined();
  });

  it('should export type definitions', () => {
    // We can't test types at runtime, but we can verify the exports exist
    expect(qubo.QueryBuilder).toBeDefined();
    expect(qubo.QueryExecutor).toBeDefined();
  });
}); 