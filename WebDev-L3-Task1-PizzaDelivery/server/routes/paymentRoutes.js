const express = require("express");

const {
  createPaymentOrder,
} = require("../controllers/paymentController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create-order",
  verifyToken,
  createPaymentOrder
);

module.exports = router;