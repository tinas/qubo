import { QueryExecutor } from '../../lib';

interface Order {
  id: string;
  customerName: string;
  total: number;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'shipped' | 'delivered';
  orderDate: Date;
  deliveryAddress: {
    street: string;
    city: string;
    country: string;
  };
}

// Sample data
const orders: Order[] = [
  {
    id: "O001",
    customerName: "Alice Johnson",
    total: 299.97,
    items: [
      { productId: "P001", quantity: 2, price: 129.99 },
      { productId: "P002", quantity: 1, price: 39.99 }
    ],
    status: "delivered",
    orderDate: new Date("2024-01-10"),
    deliveryAddress: {
      street: "123 Main St",
      city: "Boston",
      country: "USA"
    }
  },
  {
    id: "O002",
    customerName: "Bob Smith",
    total: 599.98,
    items: [
      { productId: "P003", quantity: 1, price: 599.98 }
    ],
    status: "pending",
    orderDate: new Date("2024-02-15"),
    deliveryAddress: {
      street: "456 Oak Ave",
      city: "London",
      country: "UK"
    }
  }
];

// Create query executor
const executor = new QueryExecutor<Order>(orders);

// Example 1: Check if an order has total greater than 500
const order = orders[0];
const isExpensiveOrder = executor.evaluate(order, {
  total: { $gt: 500 }
});
console.log(`Order ${order.id} is expensive:`, isExpensiveOrder);

// Example 2: Check if an order is pending and from UK
const isPendingUKOrder = executor.evaluate(orders[1], {
  $and: [
    { status: "pending" },
    { "deliveryAddress.country": "UK" }
  ]
});
console.log(`Order ${orders[1].id} is pending UK order:`, isPendingUKOrder);

// Example 3: Check if an order has multiple items
const hasMultipleItems = executor.evaluate(orders[0], {
  "items.1": { $exists: true }
});
console.log(`Order ${orders[0].id} has multiple items:`, hasMultipleItems);

// Example 4: Check if an order is recent (within last 30 days)
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const isRecentOrder = executor.evaluate(orders[1], {
  orderDate: { $gt: thirtyDaysAgo }
});
console.log(`Order ${orders[1].id} is recent:`, isRecentOrder);

// Example 5: Complex evaluation - check if order meets discount criteria
const meetsDiscountCriteria = executor.evaluate(orders[0], {
  $or: [
    // High value order
    { total: { $gte: 500 } },
    // Multiple items with specific products
    {
      $and: [
        { "items.1": { $exists: true } },
        { items: { $elemMatch: { productId: "P001" } } }
      ]
    }
  ]
});
console.log(`Order ${orders[0].id} meets discount criteria:`, meetsDiscountCriteria); 