const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.options("*", cors());

// Load env file
dotenv.config({
    path: "./config/config.env",
});

// Body parser
app.use(express.json());
app.use(cookieParser());

// Raw body for Stripe webhooks
app.use('/api/v1/guitars/webhook', express.raw({ type: 'application/json' }));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Set static folder (before security headers)
app.use(express.static(path.join(__dirname, 'public')));

// Add specific route for serving images
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'public', 'uploads', filename);
  res.sendFile(filepath);
});

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

// Route files
const auth = require("../routes/customer");
const guitars = require("../routes/GuitarRoute");
const cart = require("../routes/CartRoute");
const orders = require("../routes/OrderRoute");
const wishlist = require("../routes/WishlistRoute");
const reviews = require("../routes/ReviewRoute");
const payments = require("../routes/PaymentRoute");
const admin = require("../routes/AdminRoute");

// Mount routers
app.use("/api/v1/customers", auth);
app.use("/api/v1/guitars", guitars);
app.use("/api/v1/cart", cart);
app.use("/api/v1/orders", orders);
app.use("/api/v1/wishlist", wishlist);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/payments", payments);
app.use("/api/v1/admin", admin);

module.exports = app; 