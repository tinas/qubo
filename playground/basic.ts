import { createQubo, type Query } from '../lib';

// Sample data
const inventory = [
  {
    item: 'journal',
    instock: [
      { warehouse: 'A', qty: 5 },
      { warehouse: 'C', qty: 15 }
    ]
  },
  {
    item: 'notebook',
    instock: [{ warehouse: 'C', qty: 5 }]
  },
  {
    item: 'paper',
    instock: [
      { warehouse: 'A', qty: 60 },
      { warehouse: 'B', qty: 15 }
    ]
  },
  {
    item: 'planner',
    instock: [
      { warehouse: 'A', qty: 40 },
      { warehouse: 'B', qty: 5 }
    ]
  },
  {
    item: 'postcard',
    instock: [
      { warehouse: 'B', qty: 15 },
      { warehouse: 'C', qty: 35 }
    ]
  }
];

// Basic queries
const qubo = createQubo(inventory);

// Find items with qty between 10 and 20
const query1: Query = {
  instock: { $elemMatch: { qty: { $gt: 10, $lte: 20 } } }
};
console.log('Items with qty between 10 and 20:', qubo.find(query1));

// Find items in warehouse A with qty >= 40
const query2: Query = {
  instock: { $elemMatch: { warehouse: 'A', qty: { $gte: 40 } } }
};
console.log('Items in warehouse A with qty >= 40:', qubo.find(query2));

// Check if any item exists in warehouse C with qty < 10
const query3: Query = {
  instock: { $elemMatch: { warehouse: 'C', qty: { $lt: 10 } } }
};
console.log('Has items in warehouse C with qty < 10:', qubo.evaluate(query3));

// Find first item that has qty = 5 in any warehouse
const query4: Query = {
  instock: { $elemMatch: { qty: { $eq: 5 } } }
};
console.log('First item with qty = 5:', qubo.findOne(query4));

// findOne examples
// Find first item that has stock in both warehouse A and C
const query5: Query = {
  $and: [
    { instock: { $elemMatch: { warehouse: 'A' } } },
    { instock: { $elemMatch: { warehouse: 'C' } } }
  ]
};
console.log('First item with stock in both A and C:', qubo.findOne(query5));

// Find first item that has total qty > 50 across all warehouses
const query6: Query = {
  item: {
    $regex: '^p' // Item name starts with 'p'
  },
  instock: {
    $elemMatch: { qty: { $gt: 50 } }
  }
};
console.log('First item starting with p and having qty > 50:', qubo.findOne(query6));

// Return null when no match is found
const query7: Query = {
  instock: {
    $elemMatch: {
      warehouse: 'D' // Non-existent warehouse
    }
  }
};
console.log('Should return null for non-existent warehouse:', qubo.findOne(query7)); 