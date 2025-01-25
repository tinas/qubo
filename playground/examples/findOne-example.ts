import { QueryExecutor } from '../../lib';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  specs: {
    color: string;
    size: string;
    weight: number;
  };
  tags: string[];
  lastUpdated: Date;
}

// Sample data
const products: Product[] = [
  {
    id: "P001",
    name: "Premium Laptop",
    price: 1299.99,
    category: "Electronics",
    stock: 15,
    specs: {
      color: "Silver",
      size: "15-inch",
      weight: 2.1
    },
    tags: ["laptop", "premium", "business"],
    lastUpdated: new Date("2024-01-15")
  },
  {
    id: "P002",
    name: "Gaming Mouse",
    price: 79.99,
    category: "Gaming",
    stock: 50,
    specs: {
      color: "Black",
      size: "Standard",
      weight: 0.2
    },
    tags: ["gaming", "accessories"],
    lastUpdated: new Date("2024-02-01")
  }
];

// Create query executor
const executor = new QueryExecutor<Product>(products);

// Example 1: Find first product with price greater than 1000
const expensiveProduct = executor.findOne({
  price: { $gt: 1000 }
});
console.log("First expensive product:", expensiveProduct);

// Example 2: Find product with specific ID
const specificProduct = executor.findOne({
  id: "P002"
});
console.log("Product with ID P002:", specificProduct);

// Example 3: Complex query - find first product that matches multiple conditions
const result = executor.findOne({
  $and: [
    { category: "Gaming" },
    { stock: { $gte: 30 } },
    { "specs.color": "Black" }
  ]
});
console.log("First gaming product with high stock:", result);

// Example 4: Find product with specific tag
const taggedProduct = executor.findOne({
  tags: { $contains: "premium" }
});
console.log("First premium product:", taggedProduct); 