const asyncHandler = require("../middleware/async");
const Customer = require("../models/Customer");
const Guitar = require("../models/Guitar");
const Order = require("../models/Order");
const { protect, authorize } = require("../middleware/auth");

// @desc    Get dashboard data
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardData = asyncHandler(async (req, res, next) => {
  try {
    console.log('Fetching dashboard data...');
    
    // Get total counts
    const totalUsers = await Customer.countDocuments();
    const totalGuitars = await Guitar.countDocuments();
    const totalOrders = await Order.countDocuments();

    console.log('Basic counts:', { totalUsers, totalGuitars, totalOrders });

    // Calculate total revenue from confirmed orders
    const confirmedOrders = await Order.find({ orderStatus: "confirmed" });
    const totalRevenue = confirmedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    console.log('Revenue calculation:', { confirmedOrdersCount: confirmedOrders.length, totalRevenue });

    // Get top guitar by sales
    const guitarSales = await Order.aggregate([
      { $match: { orderStatus: "confirmed" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.guitar",
          sales: { $sum: "$items.quantity" }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 1 }
    ]);

    console.log('Guitar sales aggregation:', guitarSales);

    let topGuitar = { name: "No sales yet", sales: 0 };
    if (guitarSales.length > 0) {
      const guitar = await Guitar.findById(guitarSales[0]._id);
      if (guitar) {
        topGuitar = { name: guitar.name, sales: guitarSales[0].sales };
      }
    }

    console.log('Top guitar:', topGuitar);

    // Get top user by purchases
    const userPurchases = await Order.aggregate([
      { $match: { orderStatus: "confirmed" } },
      {
        $group: {
          _id: "$customer",
          purchases: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 1 }
    ]);

    console.log('User purchases aggregation:', userPurchases);

    let topUser = { name: "No purchases yet", purchases: 0 };
    if (userPurchases.length > 0) {
      const customer = await Customer.findById(userPurchases[0]._id);
      if (customer) {
        topUser = { 
          name: `${customer.fname} ${customer.lname}`, 
          purchases: userPurchases[0].purchases 
        };
      }
    }

    console.log('Top user:', topUser);

    // Get recent orders with populated data
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'fname lname')
      .populate('items.guitar', 'name');

    console.log('Recent orders count:', recentOrders.length);

    const dashboardData = {
      totalUsers,
      totalGuitars,
      totalOrders,
      totalRevenue,
      topGuitar,
      topUser,
      recentOrders: recentOrders.map(order => ({
        _id: order._id,
        customerName: order.customer ? `${order.customer.fname} ${order.customer.lname}` : 'Unknown',
        guitarName: order.items && order.items.length > 0 ? order.items[0].guitar?.name || 'Unknown Guitar' : 'Unknown Guitar',
        status: order.orderStatus,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount
      }))
    };

    console.log('Final dashboard data:', dashboardData);

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }

  const users = await Customer.find({ role: "customer" })
    .select('-password')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get all guitars (Admin only)
// @route   GET /api/v1/admin/guitars
// @access  Private (Admin)
exports.getAllGuitars = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }

  const guitars = await Guitar.find()
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: guitars.length,
    data: guitars
  });
});

// @desc    Get pending orders
// @route   GET /api/v1/admin/orders/pending
// @access  Private (Admin only)
exports.getPendingOrders = asyncHandler(async (req, res, next) => {
  try {
    console.log('=== FETCHING PENDING ORDERS ===');
    
    const pendingOrders = await Order.find({ orderStatus: "pending" })
      .populate('customer', 'fname lname email')
      .populate('items.guitar', 'name images price')
      .sort({ createdAt: -1 });

    console.log('Found pending orders:', pendingOrders.length);
    console.log('Pending orders:', pendingOrders.map(order => ({
      id: order._id,
      customer: order.customer ? `${order.customer.fname} ${order.customer.lname}` : 'Unknown',
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt
    })));

    res.status(200).json({
      success: true,
      count: pendingOrders.length,
      data: pendingOrders
    });
  } catch (error) {
    console.error('Get pending orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending orders',
      error: error.message
    });
  }
});

// @desc    Get confirmed orders
// @route   GET /api/v1/admin/orders/confirmed
// @access  Private (Admin only)
exports.getConfirmedOrders = asyncHandler(async (req, res, next) => {
  try {
    const confirmedOrders = await Order.find({ orderStatus: "confirmed" })
      .populate('customer', 'fname lname email')
      .populate('items.guitar', 'name images price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: confirmedOrders.length,
      data: confirmedOrders
    });
  } catch (error) {
    console.error('Get confirmed orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch confirmed orders',
      error: error.message
    });
  }
});

// @desc    Approve order
// @route   PUT /api/v1/admin/orders/:id/approve
// @access  Private (Admin only)
exports.approveOrder = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = 'confirmed';
    order.paymentStatus = 'paid';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order approved successfully',
      data: order
    });
  } catch (error) {
    console.error('Approve order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve order',
      error: error.message
    });
  }
});

// @desc    Cancel order (delete it)
// @route   PUT /api/v1/admin/orders/:id/cancel
// @access  Private (Admin only)
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Delete the order completely
    await Order.findByIdAndDelete(req.params.id);

    console.log('Order cancelled and deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order cancelled and removed successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// @desc    Delete order
// @route   DELETE /api/v1/admin/orders/:id
// @access  Private (Admin only)
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
});

// @desc    Get revenue analytics (Admin only)
// @route   GET /api/v1/admin/revenue
// @access  Private (Admin)
exports.getRevenueAnalytics = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }

  try {
    // Total revenue
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "confirmed",
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Monthly revenue for current year
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          },
          orderStatus: "confirmed",
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Top customers by spending
    const topCustomers = await Order.aggregate([
      {
        $match: {
          orderStatus: "confirmed",
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: '$customer',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    // Populate customer details
    const topCustomersWithDetails = await Customer.populate(topCustomers, {
      path: '_id',
      select: 'fname lname email'
    });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue,
        topCustomers: topCustomersWithDetails
      }
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching revenue analytics"
    });
  }
}); 

// @desc    Get payment history
// @route   GET /api/v1/admin/payments
// @access  Private (Admin only)
exports.getPayments = asyncHandler(async (req, res, next) => {
  try {
    const payments = await Order.find({ paymentStatus: { $in: ['paid', 'pending', 'refunded'] } })
      .populate('customer', 'fname lname email')
      .sort({ createdAt: -1 });

    // Transform the data for frontend and remove duplicates
    const paymentMap = new Map();
    
    payments.forEach(order => {
      const key = order.paymentId || order._id.toString();
      
      // If we already have this payment, keep the one with the most recent date
      if (paymentMap.has(key)) {
        const existing = paymentMap.get(key);
        if (order.createdAt > existing.createdAt) {
          paymentMap.set(key, order);
        }
      } else {
        paymentMap.set(key, order);
      }
    });

    const paymentData = Array.from(paymentMap.values()).map(order => ({
      _id: order._id,
      orderId: order._id,
      customerName: order.customer ? `${order.customer.fname} ${order.customer.lname}` : 'Unknown',
      customerEmail: order.customer?.email || 'No email',
      amount: order.totalAmount,
      paymentDate: order.createdAt,
      paymentMethod: order.paymentMethod || 'credit-card',
      status: order.paymentStatus,
      paymentId: order.paymentId
    }));

    res.status(200).json({
      success: true,
      count: paymentData.length,
      data: paymentData
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
});

// @desc    Delete payment (remove order completely)
// @route   DELETE /api/v1/admin/payments/:id
// @access  Private (Admin only)
exports.deletePayment = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Delete the order completely
    await Order.findByIdAndDelete(req.params.id);

    console.log('Payment deleted:', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment',
      error: error.message
    });
  }
});

// @desc    Refund payment
// @route   PUT /api/v1/admin/payments/:id/refund
// @access  Private (Admin only)
exports.refundPayment = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Only paid orders can be refunded'
      });
    }

    // Update order status
    order.paymentStatus = 'refunded';
    order.orderStatus = 'cancelled';
    await order.save();

    console.log('Payment refunded for order:', order._id);

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      data: order
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refund payment',
      error: error.message
    });
  }
}); 