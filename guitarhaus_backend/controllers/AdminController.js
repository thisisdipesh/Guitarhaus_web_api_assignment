const asyncHandler = require("../middleware/async");
const Customer = require("../models/Customer");
const Guitar = require("../models/Guitar");
const Order = require("../models/Order");
const { protect, authorize } = require("../middleware/auth");

// @desc    Get admin dashboard statistics
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }

  try {
    // Get total counts
    const totalUsers = await Customer.countDocuments({ role: "customer" });
    const totalGuitars = await Guitar.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from confirmed orders
    const confirmedOrders = await Order.find({ 
      orderStatus: "confirmed",
      paymentStatus: "paid"
    });
    
    const totalRevenue = confirmedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get recent orders (last 10)
    const recentOrders = await Order.find()
      .populate({
        path: 'customer',
        select: 'fname lname email'
      })
      .populate({
        path: 'items.guitar',
        select: 'name brand price'
      })
      .sort('-createdAt')
      .limit(10);

    // Get top selling guitars
    const guitarSales = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.guitar', totalQuantity: { $sum: '$items.quantity' } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    // Populate guitar names for top selling guitars
    const topSellingGuitars = await Guitar.populate(guitarSales, {
      path: '_id',
      select: 'name brand price'
    });

    // Get monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: "confirmed",
          paymentStatus: "paid"
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalGuitars,
          totalOrders,
          totalRevenue
        },
        recentOrders,
        topSellingGuitars,
        monthlyRevenue,
        orderStatusStats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics"
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

// @desc    Get confirmed orders (Admin only)
// @route   GET /api/v1/admin/orders/confirmed
// @access  Private (Admin)
exports.getConfirmedOrders = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }

  const confirmedOrders = await Order.find({ 
    orderStatus: "confirmed",
    paymentStatus: "paid"
  })
    .populate({
      path: 'customer',
      select: 'fname lname email'
    })
    .populate({
      path: 'items.guitar',
      select: 'name brand price images'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: confirmedOrders.length,
    data: confirmedOrders
  });
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