const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Guitar = require('../models/Guitar');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Review = require('../models/Review');

let mongoServer;

// Setup MongoDB Memory Server for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Disconnect from any existing connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Connect to test database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Helper function to create test user
const createTestUser = async (role = 'customer') => {
  const user = await Customer.create({
    fname: 'Test',
    lname: 'User',
    phone: 1234567890,
    email: 'test@example.com',
    password: 'password123',
    role: role
  });
  return user;
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '1h'
  });
};

// Helper function to create test guitar
const createTestGuitar = async () => {
  const guitar = await Guitar.create({
    name: 'Test Guitar',
    brand: 'Test Brand',
    category: 'Electric',
    price: 999.99,
    description: 'A test guitar for testing',
    images: ['test-image.jpg'],
    stock: 10,
    isAvailable: true,
    isFeatured: true
  });
  return guitar;
};

// Helper function to create test order
const createTestOrder = async (customerId, guitarId) => {
  const order = await Order.create({
    customer: customerId,
    items: [{
      guitar: guitarId,
      quantity: 1,
      price: 999.99
    }],
    totalAmount: 999.99,
    status: 'pending'
  });
  return order;
};

module.exports = {
  createTestUser,
  generateToken,
  createTestGuitar,
  createTestOrder
}; 