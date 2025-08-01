const asyncHandler = require("../middleware/async");
const Guitar = require("../models/Guitar");
const { protect, authorize } = require("../middleware/auth");

// Debug Stripe configuration
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? 'Loaded' : 'NOT LOADED');
console.log('Stripe Secret Key (first 10 chars):', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 10) + '...' : 'NOT FOUND');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Customer = require("../models/Customer"); // Added for webhook
const Order = require("../models/Order"); // Added for webhook
const Cart = require("../models/Cart"); // Added for webhook

// @desc    Get all guitars
// @route   GET /api/v1/guitars
// @access  Public
exports.getGuitars = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Guitar.countDocuments();

  let query = Guitar.find();

  // Filter by category
  if (req.query.category) {
    query = query.find({ category: req.query.category });
  }

  // Filter by brand
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);
    query = query.find({ price: priceFilter });
  }

  // Filter by availability
  if (req.query.available) {
    query = query.find({ isAvailable: req.query.available === 'true' });
  }

  // Search functionality
  if (req.query.search) {
    query = query.find({
      $text: { $search: req.query.search }
    });
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',');
    const sortOrder = {};
    sortBy.forEach(item => {
      const [field, order] = item.split(':');
      sortOrder[field] = order === 'desc' ? -1 : 1;
    });
    query = query.sort(sortOrder);
  } else {
    query = query.sort('-createdAt');
  }

  query = query.skip(startIndex).limit(limit);

  const guitars = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: guitars.length,
    pagination,
    data: guitars
  });
});

// @desc    Get single guitar
// @route   GET /api/v1/guitars/:id
// @access  Public
exports.getGuitar = asyncHandler(async (req, res, next) => {
  const guitar = await Guitar.findById(req.params.id);

  if (!guitar) {
    return res.status(404).json({ 
      success: false, 
      message: `Guitar not found with id ${req.params.id}` 
    });
  }

  res.status(200).json({
    success: true,
    data: guitar
  });
});

// @desc    Create new guitar
// @route   POST /api/v1/guitars
// @access  Private (Admin only)
exports.createGuitar = asyncHandler(async (req, res, next) => {
  console.log('Create Guitar - User:', req.user);
  console.log('Create Guitar - Request body:', req.body);
  console.log('Create Guitar - File:', req.file);
  console.log('Create Guitar - Headers:', req.headers);
  console.log('Create Guitar - Content-Type:', req.headers['content-type']);

  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      success: false, 
      message: "Access denied. Admins only." 
    });
  }

  // Handle uploaded image
  if (req.file) {
    req.body.images = [req.file.filename];
    console.log('Image uploaded:', req.file.filename);
  } else {
    req.body.images = [];
    console.log('No image uploaded');
  }

  // Handle specifications object
  if (req.body.specifications) {
    try {
      req.body.specifications = JSON.parse(req.body.specifications);
      console.log('Specifications parsed:', req.body.specifications);
    } catch (error) {
      console.error('Error parsing specifications:', error);
    }
  }

  // Ensure price and stock are numbers
  if (req.body.price) req.body.price = Number(req.body.price);
  if (req.body.stock) req.body.stock = Number(req.body.stock);

  console.log('Final request body:', req.body);

  const guitar = await Guitar.create(req.body);

  console.log('Guitar created:', guitar);

  res.status(201).json({
    success: true,
    data: guitar
  });
});

// @desc    Update guitar
// @route   PUT /api/v1/guitars/:id
// @access  Private (Admin only)
exports.updateGuitar = asyncHandler(async (req, res, next) => {
  console.log('Update Guitar - User:', req.user);
  console.log('Update Guitar - Request body:', req.body);
  console.log('Update Guitar - File:', req.file);
  console.log('Update Guitar - ID:', req.params.id);

  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      success: false, 
      message: "Access denied. Admins only." 
    });
  }

  let guitar = await Guitar.findById(req.params.id);

  if (!guitar) {
    return res.status(404).json({ 
      success: false, 
      message: `Guitar not found with id ${req.params.id}` 
    });
  }

  // Handle uploaded image
  if (req.file) {
    req.body.images = [req.file.filename];
    console.log('New image uploaded:', req.file.filename);
  }

  // Handle specifications object
  if (req.body.specifications) {
    try {
      req.body.specifications = JSON.parse(req.body.specifications);
      console.log('Specifications parsed:', req.body.specifications);
    } catch (error) {
      console.error('Error parsing specifications:', error);
    }
  }

  // Ensure price and stock are numbers
  if (req.body.price) req.body.price = Number(req.body.price);
  if (req.body.stock) req.body.stock = Number(req.body.stock);

  console.log('Final update body:', req.body);

  guitar = await Guitar.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  console.log('Guitar updated:', guitar);

  res.status(200).json({
    success: true,
    data: guitar
  });
});

// @desc    Delete guitar
// @route   DELETE /api/v1/guitars/:id
// @access  Private (Admin only)
exports.deleteGuitar = asyncHandler(async (req, res, next) => {
  console.log('Delete Guitar - User:', req.user);
  console.log('Delete Guitar - ID:', req.params.id);

  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      success: false, 
      message: "Access denied. Admins only." 
    });
  }

  const guitar = await Guitar.findById(req.params.id);

  if (!guitar) {
    return res.status(404).json({ 
      success: false, 
      message: `Guitar not found with id ${req.params.id}` 
    });
  }

  // Use findByIdAndDelete instead of remove() (which is deprecated)
  await Guitar.findByIdAndDelete(req.params.id);

  console.log('Guitar deleted successfully:', req.params.id);

  res.status(200).json({
    success: true,
    message: "Guitar deleted successfully"
  });
});

// @desc    Get featured guitars
// @route   GET /api/v1/guitars/featured
// @access  Public
exports.getFeaturedGuitars = asyncHandler(async (req, res, next) => {
  const guitars = await Guitar.find({ isFeatured: true }).limit(10);

  res.status(200).json({
    success: true,
    count: guitars.length,
    data: guitars
  });
});

// @desc    Get guitars by category
// @route   GET /api/v1/guitars/category/:category
// @access  Public
exports.getGuitarsByCategory = asyncHandler(async (req, res, next) => {
  const guitars = await Guitar.find({ category: req.params.category });

  res.status(200).json({
    success: true,
    count: guitars.length,
    data: guitars
  });
});

// @desc    Search guitars
// @route   GET /api/v1/guitars/search
// @access  Public
exports.searchGuitars = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query is required"
    });
  }

  const guitars = await Guitar.find({
    $text: { $search: q }
  });

  res.status(200).json({
    success: true,
    count: guitars.length,
    data: guitars
  });
}); 

exports.createStripeProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, specifications } = req.body;
    if (!name || !description || !price || !category || !brand || !stock) {
      return res.status(400).json({ error: 'Name, description, price, category, brand, and stock are required.' });
    }
    
    // 1. Create product in Stripe
    const product = await stripe.products.create({
      name,
      description,
      metadata: {
        category,
        brand,
        stock: stock.toString()
      }
    });
    
    // 2. Create price in Stripe (one-time payment, not subscription)
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price), // price in cents
      currency: 'inr', // Use INR for Indian Rupees
      product: product.id,
    });
    
    // 3. Return Stripe IDs only (don't save to DB here)
    res.status(201).json({
      message: 'Stripe product and price created successfully',
      stripeProductId: product.id,
      stripePriceId: stripePrice.id,
    });
  } catch (error) {
    console.error('Stripe product creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create Stripe product',
      details: error.message 
    });
  }
}; 

exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

// Create checkout session for one-time payments
exports.createOneTimeCheckoutSession = async (req, res) => {
  try {
    const { items, totalAmount, customerInfo } = req.body;
    
    console.log('Creating Stripe checkout session with:', { items, totalAmount, customerInfo });
    
    if (!items || !totalAmount) {
      return res.status(400).json({ 
        success: false,
        error: 'Items and total amount are required' 
      });
    }

    // Validate Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Stripe secret key not configured');
      return res.status(500).json({ 
        success: false,
        error: 'Payment system not configured properly' 
      });
    }

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name || 'Guitar',
          description: `Brand: ${item.brand || 'GuitarHaus'}`,
        },
        unit_amount: Math.round((item.price || 0) * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

    console.log('Stripe line items:', lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
      customer_email: customerInfo?.email,
      metadata: {
        customer_name: customerInfo?.name || '',
        customer_phone: customerInfo?.phone || '',
        total_amount: totalAmount.toString(),
      },
    });

    console.log('Stripe session created:', session.id);

    res.json({ 
      success: true,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Payment processing failed';
    
    if (error.type === 'StripeCardError') {
      errorMessage = 'Card error: ' + error.message;
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid payment request';
    } else if (error.type === 'StripeAPIError') {
      errorMessage = 'Payment service error';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      success: false,
      error: errorMessage 
    });
  }
}; 

exports.getStripeSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json({ status: session.payment_status, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

// Handle Stripe webhook for successful payments
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleSuccessfulPayment(session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Handle successful payment and create order
const handleSuccessfulPayment = async (session) => {
  try {
    console.log('Processing successful payment for session:', session.id);
    
    const { customer_email, metadata } = session;
    const { customer_name, customer_phone, total_amount } = metadata;
    
    // Find or create customer
    let customer = await Customer.findOne({ email: customer_email });
    
    if (!customer) {
      // Create new customer if doesn't exist
      customer = await Customer.create({
        fname: customer_name.split(' ')[0] || customer_name,
        lname: customer_name.split(' ').slice(1).join(' ') || '',
        email: customer_email,
        phone: parseInt(customer_phone) || 0,
        password: 'temp_password_' + Math.random().toString(36).substr(2, 9), // Temporary password
        role: 'customer'
      });
    }

    // Get line items from session
    const lineItems = session.line_items?.data || [];
    
    // Create order items
    const orderItems = [];
    for (const item of lineItems) {
      // Try to find guitar by name (since we don't have guitar ID in metadata)
      const guitar = await Guitar.findOne({ name: item.description?.replace('Brand: ', '') || item.description });
      
      if (guitar) {
        orderItems.push({
          guitar: guitar._id,
          quantity: item.quantity,
          price: item.amount_total / 100 // Convert from cents
        });
      }
    }

    // Create order
    const order = await Order.create({
      customer: customer._id,
      items: orderItems,
      totalAmount: parseFloat(total_amount),
      orderStatus: 'pending', // Will be approved by admin
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      paymentId: session.payment_intent,
      shippingAddress: {
        fullName: customer_name,
        email: customer_email,
        phone: customer_phone
      }
    });

    console.log('Order created successfully:', order._id);
    
    // Clear cart if customer was logged in
    if (customer._id) {
      await Cart.findOneAndUpdate(
        { customer: customer._id },
        { $set: { items: [] } }
      );
    }

  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}; 