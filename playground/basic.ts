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

// Object notation examples
// Direct field match (implicit $eq)
const query0: Query = {
  item: 'journal'  // Same as { item: { $eq: 'journal' } }
};
console.log('Items with item = journal:', qubo.find(query0));

// Multiple field conditions (implicit $and)
const query1: Query = {
  item: 'paper',
  instock: { $elemMatch: { warehouse: 'A' } }  // Multiple conditions are AND'ed together
};
console.log('Paper items in warehouse A:', qubo.find(query1));

// Dot notation examples
// Access array element by index
const query2: Query = {
  'instock[0].qty': { $lt: 10 }  // First element's qty < 10
};
console.log('Items with first stock qty < 10:', qubo.find(query2));

// Access specific array element's nested field
const query3: Query = {
  'instock[1].warehouse': 'B'  // Second element's warehouse is B
};
console.log('Items with second stock in warehouse B:', qubo.find(query3));

// Combine dot notation with other operators
const query4: Query = {
  item: { $regex: '^p' },
  'instock[0].qty': { $gt: 50 }  // First element's qty > 50
};
console.log('Items starting with p and first stock qty > 50:', qubo.find(query4));

// Multiple array indices in one query
const query5: Query = {
  'instock[0].warehouse': 'A',
  'instock[1].warehouse': 'B'  // Has stock in warehouse A first, then B
};
console.log('Items with stock in A then B:', qubo.find(query5));

// Find items with qty between 10 and 20
const query6: Query = {
  instock: { $elemMatch: { qty: { $gt: 10, $lte: 20 } } }
};
console.log('Items with qty between 10 and 20:', qubo.find(query6));

// Find items in warehouse A with qty >= 40
const query7: Query = {
  instock: { $elemMatch: { warehouse: 'A', qty: { $gte: 40 } } }
};
console.log('Items in warehouse A with qty >= 40:', qubo.find(query7));

// Check if any item exists in warehouse C with qty < 10
const query8: Query = {
  instock: { $elemMatch: { warehouse: 'C', qty: { $lt: 10 } } }
};
console.log('Has items in warehouse C with qty < 10:', qubo.evaluate(query8));

// Find first item that has qty = 5 in any warehouse
const query9: Query = {
  instock: { $elemMatch: { qty: { $eq: 5 } } }
};
console.log('First item with qty = 5:', qubo.findOne(query9));

// findOne examples
// Find first item that has stock in both warehouse A and C
const query10: Query = {
  $and: [
    { instock: { $elemMatch: { warehouse: 'A' } } },
    { instock: { $elemMatch: { warehouse: 'C' } } }
  ]
};
console.log('First item with stock in both A and C:', qubo.findOne(query10));

// Find first item that has total qty > 50 across all warehouses
const query11: Query = {
  item: {
    $regex: '^p' // Item name starts with 'p'
  },
  instock: {
    $elemMatch: { qty: { $gt: 50 } }
  }
};
console.log('First item starting with p and having qty > 50:', qubo.findOne(query11));

// Return null when no match is found
const query12: Query = {
  instock: {
    $elemMatch: {
      warehouse: 'D' // Non-existent warehouse
    }
  }
};
console.log('Should return null for non-existent warehouse:', qubo.findOne(query12)); 