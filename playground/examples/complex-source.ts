import { QueryExecutor } from '../../lib';

interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  alternativePhone?: string;
}

interface PaymentMethod {
  type: 'credit' | 'debit' | 'paypal';
  lastFourDigits?: string;
  expiryDate?: Date;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  metadata: {
    sku: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
}

interface Customer {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    preferences: {
      language: string;
      currency: string;
      newsletter: boolean;
    };
  };
  contactInfo: ContactInfo;
  addresses: {
    billing: Address;
    shipping: Address[];
  };
  paymentMethods: PaymentMethod[];
  orders: {
    id: string;
    date: Date;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    total: number;
    shippingMethod: {
      carrier: string;
      method: string;
      cost: number;
      estimatedDays: number;
    };
    metadata: {
      source: string;
      deviceInfo: {
        type: string;
        os: string;
      };
      ipAddress: string;
    };
  }[];
  membership: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    since: Date;
    points: number;
    benefits: string[];
  };
  tags: string[];
  lastLogin: Date;
}

// Sample complex data
const customers: Customer[] = [
  {
    id: "C001",
    personalInfo: {
      firstName: "Emma",
      lastName: "Wilson",
      dateOfBirth: new Date("1990-05-15"),
      preferences: {
        language: "en",
        currency: "USD",
        newsletter: true
      }
    },
    contactInfo: {
      email: "emma.wilson@example.com",
      phone: "+1-555-0123",
      alternativePhone: "+1-555-0124"
    },
    addresses: {
      billing: {
        street: "789 Pine Street",
        city: "San Francisco",
        country: "USA",
        postalCode: "94101"
      },
      shipping: [
        {
          street: "789 Pine Street",
          city: "San Francisco",
          country: "USA",
          postalCode: "94101"
        },
        {
          street: "456 Work Ave",
          city: "San Francisco",
          country: "USA",
          postalCode: "94102"
        }
      ]
    },
    paymentMethods: [
      {
        type: "credit",
        lastFourDigits: "4532",
        expiryDate: new Date("2025-12-31")
      },
      {
        type: "paypal"
      }
    ],
    orders: [
      {
        id: "O001",
        date: new Date("2024-01-15"),
        status: "delivered",
        items: [
          {
            productId: "P001",
            name: "Premium Headphones",
            quantity: 1,
            unitPrice: 299.99,
            discount: 30,
            metadata: {
              sku: "HD-PRO-001",
              weight: 0.5,
              dimensions: {
                length: 20,
                width: 15,
                height: 8
              }
            }
          }
        ],
        total: 269.99,
        shippingMethod: {
          carrier: "FedEx",
          method: "Express",
          cost: 15.99,
          estimatedDays: 2
        },
        metadata: {
          source: "mobile-app",
          deviceInfo: {
            type: "smartphone",
            os: "iOS"
          },
          ipAddress: "192.168.1.1"
        }
      }
    ],
    membership: {
      tier: "gold",
      since: new Date("2023-01-01"),
      points: 2500,
      benefits: ["free-shipping", "priority-support", "exclusive-deals"]
    },
    tags: ["loyal", "high-value", "tech-savvy"],
    lastLogin: new Date("2024-02-15")
  }
];

// Create query executor
const executor = new QueryExecutor<Customer>(customers);

// Example queries using the complex data structure
const result1 = executor.find({
  "personalInfo.preferences.language": "en",
  "membership.tier": "gold",
  "orders.items": {
    $elemMatch: {
      unitPrice: { $gt: 200 },
      discount: { $exists: true }
    }
  }
});
console.log("Complex Query Result 1:", result1);

const result2 = executor.find({
  $and: [
    { "addresses.shipping": { $size: 2 } },
    { "paymentMethods.type": "credit" },
    { tags: { $contains: "loyal" } },
    { "orders.metadata.deviceInfo.type": "smartphone" }
  ]
});
console.log("Complex Query Result 2:", result2);

const result3 = executor.find({
  $or: [
    { "membership.points": { $gt: 2000 } },
    { "orders.total": { $gt: 500 } }
  ],
  "addresses.billing.country": "USA",
  "paymentMethods": {
    $elemMatch: {
      type: "credit",
      lastFourDigits: { $exists: true }
    }
  }
});
console.log("Complex Query Result 3:", result3); 