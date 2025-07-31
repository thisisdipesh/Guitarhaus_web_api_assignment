const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboardData,
  getPendingOrders,
  getConfirmedOrders,
  approveOrder,
  cancelOrder,
  deleteOrder,
  getPayments,
  refundPayment,
  deletePayment
} = require("../controllers/AdminController");

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

// Dashboard route
router.get("/dashboard", getDashboardData);

// Order management routes
router.get("/orders/pending", getPendingOrders);
router.get("/orders/confirmed", getConfirmedOrders);
router.put("/orders/:id/approve", approveOrder);
router.put("/orders/:id/cancel", cancelOrder);
router.delete("/orders/:id", deleteOrder);

// Payment management routes
router.get("/payments", getPayments);
router.put("/payments/:id/refund", refundPayment);
router.delete("/payments/:id", deletePayment);

module.exports = router; 