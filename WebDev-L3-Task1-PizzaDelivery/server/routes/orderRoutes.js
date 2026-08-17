const express = require("express");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// USER ORDERS
// ===============================

// Create order
router.post("/", verifyToken, createOrder);

// Get logged-in user's orders
router.get("/", verifyToken, getMyOrders);

// ===============================
// ADMIN ORDERS
// ===============================

// Get all orders
router.get(
  "/admin",
  verifyToken,
  verifyAdmin,
  getAllOrders
);

// Update order status
router.put(
  "/admin/:id/status",
  verifyToken,
  verifyAdmin,
  updateOrderStatus
);

module.exports = router;