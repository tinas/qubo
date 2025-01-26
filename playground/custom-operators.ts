import { createQubo, type Query, type CustomOperator } from '../lib';

// Sample data
const products = [
  {
    name: 'Laptop',
    price: 1200,
    specs: {
      ram: 16,
      storage: 512,
      processor: 'i7'
    },
    ratings: [4.5, 4.8, 4.2, 4.9],
    releaseDate: '2023-01-15'
  },
  {
    name: 'Smartphone',
    price: 800,
    specs: {
      ram: 8,
      storage: 256,
      processor: 'A15'
    },
    ratings: [4.7, 4.6, 4.8, 4.9],
    releaseDate: '2023-03-20'
  },
  {
    name: 'Tablet',
    price: 600,
    specs: {
      ram: 4,
      storage: 128,
      processor: 'A14'
    },
    ratings: [4.3, 4.1, 4.4],
    releaseDate: '2022-11-10'
  }
];

// Custom operator: $avg - checks if average of array values meets a condition
const $avg: CustomOperator = {
  name: '$avg',
  fn: (value: unknown, operand: unknown) => {
    if (!Array.isArray(value) || typeof operand !== 'object' || operand === null) {
      return false;
    }

    const avg = value.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0) / value.length;
    const condition = operand as { $gt?: number };
    return typeof condition.$gt === 'number' && avg > condition.$gt;
  }
};

// Custom operator: $dateAfter - checks if a date string is after the given date
const $dateAfter: CustomOperator = {
  name: '$dateAfter',
  fn: (value: unknown, operand: unknown) => {
    if (typeof value !== 'string' || typeof operand !== 'string') {
      return false;
    }

    return new Date(value) > new Date(operand);
  }
};

// Create Qubo instance with custom operators
const qubo = createQubo(products, {
  operators: [$avg, $dateAfter]
});

// Find products with average rating greater than 4.5
const query1: Query = {
  ratings: { $avg: { $gt: 4.5 } }
};
console.log('Products with high average rating:', qubo.find(query1));

// Find products released after a specific date
const query2: Query = {
  releaseDate: { $dateAfter: '2023-01-01' }
};
console.log('Products released after Jan 2023:', qubo.find(query2));

// Combine custom operators with built-in operators
const query3: Query = {
  $and: [
    { ratings: { $avg: { $gt: 4.5 } } },
    { price: { $lt: 1000 } }
  ]
};
console.log('Affordable products with high ratings:', qubo.find(query3));

// This will throw an error because operator name doesn't start with $
try {
  const invalidOperator: CustomOperator = {
    name: 'invalid',
    fn: () => true
  };
  createQubo(products, { operators: [invalidOperator] });
} catch (error) {
  console.error('Error:', error.message);
}

// This will throw an error because operator is unknown
try {
  const query4: Query = {
    age: { $unknown: 25 }
  };
  qubo.find(query4);
} catch (error) {
  console.error('Error:', error.message);
} 