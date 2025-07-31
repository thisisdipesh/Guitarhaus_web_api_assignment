const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/uploads");

const {
  getGuitars,
  getGuitar,
  createGuitar,
  updateGuitar,
  deleteGuitar,
  getFeaturedGuitars,
  getGuitarsByCategory,
  searchGuitars,
  createStripeProduct
} = require("../controllers/GuitarController");

// Public routes
router.get("/", getGuitars);
router.get("/featured", getFeaturedGuitars);
router.get("/category/:category", getGuitarsByCategory);
router.get("/search", searchGuitars);
router.get("/:id", getGuitar);
router.get('/stripe-session/:session_id', require('../controllers/GuitarController').getStripeSession);

// Admin only routes
router.post("/", protect, authorize("admin"), upload.single("image"), createGuitar);
router.post('/create-stripe-product', createStripeProduct);
router.post('/create-checkout-session', require('../controllers/GuitarController').createCheckoutSession);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateGuitar);
router.delete("/:id", protect, authorize("admin"), deleteGuitar);

module.exports = router; 