import { createQubo, type Query } from '../lib';

// Sample data
const products = [
  {
    name: 'Laptop',
    price: 1200,
    category: 'Electronics',
    specs: {
      ram: 16,
      storage: 512,
      processor: 'i7'
    },
    inStock: true,
    tags: ['computer', 'premium']
  },
  {
    name: 'Smartphone',
    price: 800,
    category: 'Electronics',
    specs: {
      ram: 8,
      storage: 256,
      processor: 'A15'
    },
    inStock: true,
    tags: ['mobile', 'premium']
  },
  {
    name: 'Headphones',
    price: 200,
    category: 'Electronics',
    specs: {
      type: 'wireless',
      battery: 20
    },
    inStock: false,
    tags: ['audio', 'wireless']
  }
];

const qubo = createQubo(products);

// $and operator examples
const query1: Query = {
  $and: [
    { category: 'Electronics' },
    { price: { $gt: 500 } },
    { inStock: true }
  ]
};
console.log('Expensive electronics in stock:', qubo.find(query1));

// $or operator examples
const query2: Query = {
  $or: [
    { price: { $lt: 300 } },
    { tags: { $in: ['premium'] } }
  ]
};
console.log('Budget or premium items:', qubo.find(query2));

// $not operator examples
const query3: Query = {
  price: { $not: { $gt: 1000 } }
};
console.log('Items not more expensive than 1000:', qubo.find(query3));

// $nor operator examples
const query4: Query = {
  $nor: [
    { inStock: false },
    { price: { $lt: 500 } }
  ]
};
console.log('In stock items not less than 500:', qubo.find(query4));

// Nested logical operators
const query5: Query = {
  $or: [
    {
      $and: [
        { category: 'Electronics' },
        { price: { $lt: 300 } }
      ]
    },
    {
      $and: [
        { tags: { $in: ['premium'] } },
        { inStock: true }
      ]
    }
  ]
};
console.log('Budget electronics or premium in-stock items:', qubo.find(query5));

// Complex nested query
const query6: Query = {
  $and: [
    {
      $or: [
        { price: { $gte: 1000 } },
        { tags: { $in: ['wireless'] } }
      ]
    },
    {
      $not: {
        $and: [
          { inStock: false },
          { category: { $ne: 'Electronics' } }
        ]
      }
    }
  ]
};
console.log('High-end or wireless electronics:', qubo.find(query6)); 