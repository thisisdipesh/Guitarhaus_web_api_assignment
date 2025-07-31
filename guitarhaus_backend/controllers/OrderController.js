const asyncHandler = require("../middleware/async");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Guitar = require("../models/Guitar");
const { protect, authorize } = require("../middleware/auth");
const Customer = require("../models/Customer"); // Added for Stripe order creation

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod, notes } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ customer: req.user.id }).populate({
    path: 'items.guitar',
    select: 'name price stock isAvailable'
  });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty"
    });
  }

  // Validate stock and calculate totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const guitar = item.guitar;
    
    if (!guitar.isAvailable) {
      return res.status(400).json({
        success: false,
        message: `${guitar.name} is not available`
      });
    }

    if (guitar.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${guitar.name}`
      });
    }

    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      guitar: item.guitar._id,
      quantity: item.quantity,
      price: item.price
    });
  }

  // Calculate tax and shipping (you can customize these calculations)
  const tax = subtotal * 0.1; // 10% tax
  const shippingCost = subtotal > 1000 ? 0 : 50; // Free shipping over $1000
  const totalAmount = subtotal + tax + shippingCost;

  // Create order
  const order = await Order.create({
    customer: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    tax,
    shippingCost,
    totalAmount,
    notes
  });

  // Update guitar stock
  for (const item of cart.items) {
    await Guitar.findByIdAndUpdate(item.guitar._id, {
      $inc: { stock: -item.quantity }
    });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  // Populate order details
  await order.populate({
    path: 'items.guitar',
    select: 'name brand price images'
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order
  });
});

// @desc    Get user's orders
// @route   GET /api/v1/orders
// @access  Private
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ customer: req.user.id })
    .populate({
      path: 'items.guitar',
      select: 'name brand price images'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: 'items.guitar',
    select: 'name brand price images'
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  // Check if user owns this order or is admin
  if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders (Admin only)
// @route   GET /api/v1/orders/admin/all
// @access  Private (Admin)
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }

  const orders = await Order.find()
    .populate({
      path: 'customer',
      select: 'fname lname email'
    })
    .populate({
      path: 'items.guitar',
      select: 'name brand price'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Update order status (Admin only)
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }

  const { orderStatus, paymentStatus, trackingNumber, estimatedDelivery } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  const updateData = {};
  if (orderStatus) updateData.orderStatus = orderStatus;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  if (trackingNumber) updateData.trackingNumber = trackingNumber;
  if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate({
    path: 'items.guitar',
    select: 'name brand price images'
  });

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: updatedOrder
  });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  // Check if user owns this order or is admin
  if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  // Only allow cancellation if order is pending or confirmed
  if (!['pending', 'confirmed'].includes(order.orderStatus)) {
    return res.status(400).json({
      success: false,
      message: "Order cannot be cancelled at this stage"
    });
  }

  order.orderStatus = 'cancelled';
  await order.save();

  // Restore stock if order was confirmed
  if (order.orderStatus === 'confirmed') {
    for (const item of order.items) {
      await Guitar.findByIdAndUpdate(item.guitar, {
        $inc: { stock: item.quantity }
      });
    }
  }

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order
  });
}); 

// @desc    Create order from Stripe payment session
// @route   POST /api/v1/orders/create-from-stripe
// @access  Public (called from success page)
exports.createOrderFromStripe = asyncHandler(async (req, res, next) => {
  try {
    console.log('=== CREATING ORDER FROM STRIPE ===');
    console.log('Request body:', req.body);
    
    const { customerInfo, items, totalAmount, paymentMethod, paymentId } = req.body;

    console.log('Extracted data:', {
      customerInfo,
      items_count: items?.length,
      totalAmount,
      paymentMethod,
      paymentId
    });

    // Check if order with this payment ID already exists
    if (paymentId) {
      const existingOrder = await Order.findOne({ paymentId: paymentId });
      if (existingOrder) {
        console.log('⚠️ Order with payment ID already exists:', paymentId);
        return res.status(200).json({
          success: true,
          message: "Order already exists",
          order: existingOrder
        });
      }
    }

    // Additional check: Look for recent orders with same customer, amount, and time
    const recentTime = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    const duplicateOrder = await Order.findOne({
      customer: customer._id,
      totalAmount: parseFloat(totalAmount),
      createdAt: { $gte: recentTime }
    });

    if (duplicateOrder) {
      console.log('⚠️ Recent duplicate order found:', duplicateOrder._id);
      return res.status(200).json({
        success: true,
        message: "Recent order already exists",
        order: duplicateOrder
      });
    }

    // Validate required fields
    if (!customerInfo || !customerInfo.email) {
      console.error('❌ Missing customer email');
      return res.status(400).json({
        success: false,
        message: "Customer email is required"
      });
    }

    if (!items || items.length === 0) {
      console.error('❌ No items provided');
      return res.status(400).json({
        success: false,
        message: "At least one item is required"
      });
    }

    // Find or create customer
    let customer = await Customer.findOne({ email: customerInfo.email });
    
    if (!customer) {
      console.log('Creating new customer for:', customerInfo.email);
      customer = await Customer.create({
        fname: customerInfo.name.split(' ')[0] || customerInfo.name,
        lname: customerInfo.name.split(' ').slice(1).join(' ') || '',
        email: customerInfo.email,
        phone: customerInfo.phone || '0',
        password: 'temp_password_' + Math.random().toString(36).substr(2, 9), // Generate random password
        role: "customer"
      });
      console.log('✅ New customer created:', customer._id);
    } else {
      console.log('✅ Existing customer found:', customer._id);
    }

    // Find guitars by name (case-insensitive)
    const guitarNames = items.map(item => item.name);
    console.log('Looking for guitars:', guitarNames);
    
    const guitars = await Guitar.find({
      name: { $in: guitarNames.map(name => new RegExp(name, 'i')) }
    });
    
    console.log('Found guitars:', guitars.length);
    guitars.forEach(guitar => {
      console.log('- Guitar:', guitar.name, 'Price:', guitar.price);
    });

    // Create order items
    const orderItems = [];
    for (const item of items) {
      // Try to find guitar by name (case-insensitive)
      let guitar = null;
      
      // First try exact match (case-insensitive)
      guitar = await Guitar.findOne({
        name: { $regex: `^${item.name}$`, $options: 'i' }
      });
      
      // If not found, try partial match
      if (!guitar) {
        guitar = await Guitar.findOne({
          name: { $regex: item.name, $options: 'i' }
        });
      }
      
      // If still not found, try matching by brand or model
      if (!guitar) {
        guitar = await Guitar.findOne({
          $or: [
            { brand: { $regex: item.name, $options: 'i' } },
            { name: { $regex: item.name.split(' ')[0], $options: 'i' } }
          ]
        });
      }
      
      const orderItem = {
        name: item.name,
        price: item.price,
        quantity: item.quantity
      };
      
      // Add guitar reference if found
      if (guitar) {
        orderItem.guitar = guitar._id;
        console.log(`✅ Found guitar: ${guitar.name} (${guitar._id}) for item: ${item.name}`);
      } else {
        console.log(`⚠️ Guitar not found for: ${item.name}, creating item without guitar reference`);
      }
      
      orderItems.push(orderItem);
    }

    console.log('Order items prepared:', orderItems);

    // Create the order
    const orderData = {
      customer: customer._id,
      items: orderItems,
      totalAmount: parseFloat(totalAmount),
      paymentMethod: paymentMethod,
      paymentId: paymentId,
      paymentStatus: 'paid',
      orderStatus: 'pending',
      shippingAddress: {
        fullName: customerInfo.name,
        address: 'Online Purchase', // Default for online orders
        city: 'Online',
        state: 'Online',
        postalCode: '00000',
        country: 'Online',
        phone: customerInfo.phone
      },
      subtotal: parseFloat(totalAmount), // Required field
      tax: 0, // Default tax
      shippingCost: 0 // Default shipping cost
    };

    console.log('Final order data:', orderData);

    const order = await Order.create(orderData);
    
    console.log('✅ Order created successfully:', order._id);
    console.log('Order status:', order.orderStatus);
    console.log('Payment status:', order.paymentStatus);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: order
    });
  } catch (error) {
    console.error('❌ Error in createOrderFromStripe:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
}); 