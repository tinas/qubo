import { QueryExecutor } from '../../lib';

interface User {
  name: string;
  age: number;
  email: string;
  tags: string[];
  address: {
    city: string;
    country: string;
  };
}

// Sample data
const users: User[] = [
  {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    tags: ["premium", "active"],
    address: {
      city: "New York",
      country: "USA"
    }
  },
  {
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com",
    tags: ["active"],
    address: {
      city: "London",
      country: "UK"
    }
  }
];

// Create query executor
const executor = new QueryExecutor<User>(users);

// Example 1: Simple query - find users with age >= 30
const olderUsers = executor.find({
  age: { $gte: 30 }
});
console.log("Users age >= 30:", olderUsers);

// Example 2: Complex query - find users from USA or UK
const result = executor.find({
  $or: [
    { "address.country": "USA" },
    { "address.country": "UK" }
  ]
});
console.log("Users from USA or UK:", result); 