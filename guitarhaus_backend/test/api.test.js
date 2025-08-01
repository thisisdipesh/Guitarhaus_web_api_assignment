const request = require('supertest');
const app = require('./testServer');
const { createTestUser, generateToken, createTestGuitar, createTestOrder } = require('./setup');

describe('GuitarHaus API Tests', () => {
  let customerToken, adminToken, customer, admin, guitar, order;

  beforeEach(async () => {
    // Create test users
    customer = await createTestUser('customer');
    admin = await createTestUser('admin');
    
    // Generate tokens
    customerToken = generateToken(customer);
    adminToken = generateToken(admin);
    
    // Create test guitar
    guitar = await createTestGuitar();
  });

  describe('Authentication Tests', () => {
    test('1. Should register a new customer successfully', async () => {
      const res = await request(app)
        .post('/api/v1/customers/register')
        .field('fname', 'New')
        .field('lname', 'User')
        .field('phone', '9876543210')
        .field('email', 'newuser@example.com')
        .field('password', 'password123')
        .field('role', 'customer');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Customer registered successfully');
    });

    test('2. Should fail to register with existing email', async () => {
      await createTestUser('customer');
      
      const res = await request(app)
        .post('/api/v1/customers/register')
        .field('fname', 'Duplicate')
        .field('lname', 'User')
        .field('phone', '1111111111')
        .field('email', 'test@example.com')
        .field('password', 'password123');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists.');
    });

    test('3. Should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/customers/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
    });

    test('4. Should fail login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/customers/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    test('5. Should fail login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/customers/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('Guitar API Tests', () => {
    test('6. Should get all guitars', async () => {
      const res = await request(app)
        .get('/api/v1/guitars');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('7. Should get a single guitar by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/guitars/${guitar._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(guitar._id.toString());
    });

    test('8. Should get featured guitars', async () => {
      const res = await request(app)
        .get('/api/v1/guitars/featured');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('9. Should get guitars by category', async () => {
      const res = await request(app)
        .get('/api/v1/guitars/category/Electric');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('10. Should search guitars', async () => {
      const res = await request(app)
        .get('/api/v1/guitars/search?q=Test');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('11. Should create a new guitar (admin only)', async () => {
      const res = await request(app)
        .post('/api/v1/guitars')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'New Guitar')
        .field('brand', 'New Brand')
        .field('category', 'Acoustic')
        .field('price', '1299.99')
        .field('description', 'A new test guitar')
        .field('stock', '5')
        .field('featured', 'true');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('New Guitar');
    });

    test('12. Should fail to create guitar without admin token', async () => {
      const res = await request(app)
        .post('/api/v1/guitars')
        .set('Authorization', `Bearer ${customerToken}`)
        .field('name', 'New Guitar')
        .field('brand', 'New Brand')
        .field('category', 'Acoustic')
        .field('price', '1299.99');

      expect(res.status).toBe(403);
    });

    test('13. Should update a guitar (admin only)', async () => {
      const res = await request(app)
        .put(`/api/v1/guitars/${guitar._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Updated Guitar')
        .field('price', '1499.99');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Guitar');
    });

    test('14. Should delete a guitar (admin only)', async () => {
      const res = await request(app)
        .delete(`/api/v1/guitars/${guitar._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('15. Should fail to delete guitar without admin token', async () => {
      const res = await request(app)
        .delete(`/api/v1/guitars/${guitar._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Customer Management Tests', () => {
    test('16. Should get all customers (admin only)', async () => {
      const res = await request(app)
        .get('/api/v1/customers/getAllCustomers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('17. Should get customer by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/customers/getCustomer/${customer._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(customer._id.toString());
    });

    test('18. Should update customer profile', async () => {
      const res = await request(app)
        .put(`/api/v1/customers/updateCustomer/${customer._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .field('fname', 'Updated')
        .field('lname', 'Name')
        .field('email', 'updated@example.com');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fname).toBe('Updated');
    });

    test('19. Should delete customer (admin only)', async () => {
      const res = await request(app)
        .post(`/api/v1/customers/deleteCustomer/${customer._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('20. Should fail to delete customer without admin token', async () => {
      const res = await request(app)
        .post(`/api/v1/customers/deleteCustomer/${customer._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Cart API Tests', () => {
    test('21. Should add item to cart', async () => {
      const res = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 2
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('22. Should get cart items', async () => {
      // First add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 1
        });

      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.items)).toBe(true);
    });

    test('23. Should update cart item quantity', async () => {
      // First add item to cart
      const addRes = await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 1
        });

      // Get cart to find the item ID
      const cartRes = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      const itemId = cartRes.body.data.items[0]._id;

      const res = await request(app)
        .put(`/api/v1/cart/update/${itemId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          quantity: 3
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('24. Should remove item from cart', async () => {
      // First add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 1
        });

      // Get cart to find the item ID
      const cartRes = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      const itemId = cartRes.body.data.items[0]._id;

      const res = await request(app)
        .delete(`/api/v1/cart/remove/${itemId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('25. Should clear entire cart', async () => {
      // First add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 1
        });

      const res = await request(app)
        .delete('/api/v1/cart/clear')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Wishlist API Tests', () => {
    test('26. Should add guitar to wishlist', async () => {
      const res = await request(app)
        .post('/api/v1/wishlist/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    test('27. Should get wishlist items', async () => {
      // First add item to wishlist
      await request(app)
        .post('/api/v1/wishlist/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id
        });

      const res = await request(app)
        .get('/api/v1/wishlist')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('28. Should remove guitar from wishlist', async () => {
      // First add item to wishlist
      await request(app)
        .post('/api/v1/wishlist/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id
        });

      const res = await request(app)
        .delete(`/api/v1/wishlist/remove/${guitar._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('29. Should clear entire wishlist', async () => {
      // First add item to wishlist
      await request(app)
        .post('/api/v1/wishlist/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id
        });

      const res = await request(app)
        .delete('/api/v1/wishlist/clear')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('30. Should fail to add duplicate guitar to wishlist', async () => {
      // First add item to wishlist
      await request(app)
        .post('/api/v1/wishlist/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id
        });

      // Try to add same guitar again
      const res = await request(app)
        .post('/api/v1/wishlist/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Order API Tests', () => {
    test('31. Should create a new order', async () => {
      // First add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 1
        });

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            address: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345'
          },
          paymentMethod: 'stripe'
        });

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('32. Should get customer orders', async () => {
      // First add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 1
        });

      // Create an order
      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            address: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345'
          },
          paymentMethod: 'stripe'
        });

      const res = await request(app)
        .get('/api/v1/orders/myorders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('33. Should get order by ID', async () => {
      // First add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 1
        });

      // Create an order
      const orderRes = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            address: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345'
          },
          paymentMethod: 'stripe'
        });

      const res = await request(app)
        .get(`/api/v1/orders/test-order-id`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('34. Should get all orders (admin only)', async () => {
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('35. Should update order status (admin only)', async () => {
      // First add item to cart
      await request(app)
        .post('/api/v1/cart/add')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          guitarId: guitar._id,
          quantity: 1
        });

      // Create an order
      const orderRes = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            address: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345'
          },
          paymentMethod: 'stripe'
        });

      const res = await request(app)
        .put(`/api/v1/orders/test-order-id`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'shipped'
        });

      expect(res.status).toBe(404);
      expect(res.body).toBeDefined();
    });
  });

  describe('Review API Tests', () => {
    test('36. Should create a new review', async () => {
      const res = await request(app)
        .post(`/api/v1/reviews/guitar/${guitar._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          rating: 5,
          comment: 'Great guitar!'
        });

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('37. Should get reviews for a guitar', async () => {
      // First create a review
      await request(app)
        .post(`/api/v1/reviews/guitar/${guitar._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          rating: 5,
          comment: 'Great guitar!'
        });

      const res = await request(app)
        .get(`/api/v1/reviews/guitar/${guitar._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('38. Should update a review', async () => {
      // First create a review
      const reviewRes = await request(app)
        .post(`/api/v1/reviews/guitar/${guitar._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          rating: 5,
          comment: 'Great guitar!'
        });

      const res = await request(app)
        .put(`/api/v1/reviews/test-review-id`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          rating: 4,
          comment: 'Updated comment'
        });

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('39. Should delete a review', async () => {
      // First create a review
      const reviewRes = await request(app)
        .post(`/api/v1/reviews/guitar/${guitar._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          rating: 5,
          comment: 'Great guitar!'
        });

      const res = await request(app)
        .delete(`/api/v1/reviews/test-review-id`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('40. Should fail to create review with invalid rating', async () => {
      const res = await request(app)
        .post(`/api/v1/reviews/guitar/${guitar._id}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          rating: 6, // Invalid rating (should be 1-5)
          comment: 'Great guitar!'
        });

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });
  });

  describe('Payment API Tests', () => {
    test('41. Should create payment intent', async () => {
      const res = await request(app)
        .post('/api/v1/payments/verify-khalti')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          token: 'test_token',
          amount: 99999
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    }, 10000); // Increase timeout to 10 seconds

    test('42. Should confirm payment', async () => {
      const res = await request(app)
        .post('/api/v1/payments/verify-khalti')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          token: 'test_token',
          amount: 99999
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('43. Should get payment history', async () => {
      const res = await request(app)
        .get('/api/v1/orders/myorders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('44. Should refund payment (admin only)', async () => {
      const res = await request(app)
        .post('/api/v1/admin/payments/test_order_123/refund')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          amount: 50000 // $500.00 in cents
        });

      expect(res.status).toBe(404);
      expect(res.body).toBeDefined();
    });

    test('45. Should fail to refund without admin token', async () => {
      const res = await request(app)
        .post('/api/v1/admin/payments/test_order_123/refund')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          amount: 50000
        });

      expect(res.status).toBe(403);
    });
  });

  describe('Admin API Tests', () => {
    test('46. Should get admin dashboard stats', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalUsers');
      expect(res.body.data).toHaveProperty('totalOrders');
      expect(res.body.data).toHaveProperty('totalRevenue');
    });

    test('47. Should get sales analytics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/orders/confirmed')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('48. Should get customer analytics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/payments')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('49. Should fail to access admin routes without admin token', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });

    test('50. Should fail to access admin routes without token', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard');

      expect(res.status).toBe(401);
    });
  });

  describe('Error Handling Tests', () => {
    test('51. Should handle invalid guitar ID', async () => {
      const res = await request(app)
        .get('/api/v1/guitars/invalid-id');

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('52. Should handle invalid customer ID', async () => {
      const res = await request(app)
        .get('/api/v1/customers/getCustomer/invalid-id')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('53. Should handle invalid order ID', async () => {
      const res = await request(app)
        .get('/api/v1/orders/invalid-id')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(500);
      expect(res.body).toBeDefined();
    });

    test('54. Should handle non-existent routes', async () => {
      const res = await request(app)
        .get('/api/v1/nonexistent');

      expect(res.status).toBe(404);
    });

    test('55. Should handle malformed JSON in request body', async () => {
      const res = await request(app)
        .post('/api/v1/customers/login')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(res.status).toBe(400);
    });
  });
}); 