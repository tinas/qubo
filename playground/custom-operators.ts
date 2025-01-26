import { createQubo, type Operator, type Query } from '../lib';

// Sample data
const users = [
  { name: 'John', age: 25, roles: ['user'] },
  { name: 'Jane', age: 30, roles: ['user', 'admin'] },
  { name: 'Bob', age: 20, roles: ['user'] },
  { name: 'Alice', age: 35, roles: ['user', 'admin', 'superadmin'] }
];

// Custom operator that checks if a value is within a range
const $range: Operator = {
  name: '$range',
  fn: (value: unknown, range: [number, number]) => {
    if (typeof value === 'number' && Array.isArray(range) && range.length === 2) {
      const [min, max] = range;
      return value >= min && value <= max;
    }
    return false;
  }
};

// Custom operator that checks if an array contains all specified values
const $hasAll: Operator = {
  name: '$hasAll',
  fn: (value: unknown, required: unknown[]) => {
    if (Array.isArray(value) && Array.isArray(required)) {
      return required.every(item => value.includes(item));
    }
    return false;
  }
};

// Create qubo instance with custom operators
const qubo = createQubo(users, {
  operators: [$range, $hasAll]
});

// Find users with age between 25 and 35
const query1: Query = {
  age: { $range: [25, 35] }
};
console.log('Users aged 25-35:', qubo.find(query1));

// Find users that have both 'user' and 'admin' roles
const query2: Query = {
  roles: { $hasAll: ['user', 'admin'] }
};
console.log('Users with user and admin roles:', qubo.find(query2));

// This will throw an error because operator name doesn't start with $
try {
  const invalidOperator: Operator = {
    name: 'invalid',
    fn: () => true
  };
  createQubo(users, { operators: [invalidOperator] });
} catch (error) {
  console.error('Error:', error.message);
}

// This will throw an error because operator is unknown
try {
  const query3: Query = {
    age: { $unknown: 25 }
  };
  qubo.find(query3);
} catch (error) {
  console.error('Error:', error.message);
} 