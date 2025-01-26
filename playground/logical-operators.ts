import { createQubo, type Query } from '../lib';

// Sample data
const products = [
  { name: 'Phone', price: 699, category: 'Electronics', inStock: true },
  { name: 'Laptop', price: 1299, category: 'Electronics', inStock: false },
  { name: 'Book', price: 15, category: 'Books', inStock: true },
  { name: 'Tablet', price: 499, category: 'Electronics', inStock: true },
  { name: 'Headphones', price: 99, category: 'Electronics', inStock: true },
  { name: 'Magazine', price: 10, category: 'Books', inStock: false }
];

const qubo = createQubo(products);

// Find electronics that are either cheap (< 100) or expensive (> 1000)
const query1: Query = {
  category: 'Electronics',
  $or: [
    { price: { $lt: 100 } },
    { price: { $gt: 1000 } }
  ]
};
console.log('Cheap or expensive electronics:', qubo.find(query1));

// Find products that are not electronics and are in stock
const query2: Query = {
  $and: [
    { category: { $neq: 'Electronics' } },
    { inStock: true }
  ]
};
console.log('Non-electronics in stock:', qubo.find(query2));

// Find products that are neither books nor out of stock
const query3: Query = {
  $nor: [
    { category: 'Books' },
    { inStock: false }
  ]
};
console.log('Products that are not books and are in stock:', qubo.find(query3));

// Find products that don't match expensive electronics criteria
const query4: Query = {
  $not: {
    $and: [
      { category: 'Electronics' },
      { price: { $gte: 1000 } }
    ]
  }
};
console.log('Products that are not expensive electronics:', qubo.find(query4)); 