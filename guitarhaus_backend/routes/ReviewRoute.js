const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  getGuitarReviews,
  addReview,
  updateReview,
  deleteReview,
  getUserReviews,
  getAllReviews,
  getPublicReviews
} = require("../controllers/ReviewController");

// Public routes
router.get("/", getPublicReviews);
router.get("/guitar/:guitarId", getGuitarReviews);

// Protected routes
router.use(protect);
router.post("/guitar/:guitarId", addReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);
router.get("/user", getUserReviews);

// Admin route to get all reviews
router.get("/admin/all", protect, authorize("admin"), getAllReviews);

module.exports = router;
