const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  getDashboardStats,
  getAllUsers,
  getAllGuitars,
  getConfirmedOrders,
  getRevenueAnalytics
} = require("../controllers/AdminController");

// All routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

// Dashboard routes
router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/guitars", getAllGuitars);
router.get("/orders/confirmed", getConfirmedOrders);
router.get("/revenue", getRevenueAnalytics);

module.exports = router; 