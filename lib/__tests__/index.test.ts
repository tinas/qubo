import { createQubo, type Qubo, type Query } from '..';

describe('Package Exports', () => {
  it('should export createQubo function', () => {
    expect(createQubo).toBeDefined();
    expect(typeof createQubo).toBe('function');
  });

  it('should create a working Qubo instance from package export', () => {
    const data = [{ id: 1, name: 'Test' }];
    const qubo = createQubo(data);

    // Test type inference
    const typedQubo: Qubo<typeof data[0]> = qubo;

    // Test query functionality
    const query: Query = { id: 1 };
    const result = typedQubo.find(query);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
}); 