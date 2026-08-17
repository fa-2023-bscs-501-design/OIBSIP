const express = require("express");

const {
  getInventory,
  addInventoryItem,
  updateStock,
  updateThreshold,
} = require("../controllers/inventoryController");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// ADMIN - GET ALL INVENTORY
// ===============================

router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getInventory
);

// ===============================
// ADMIN - ADD INVENTORY ITEM
// ===============================

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  addInventoryItem
);

// ===============================
// ADMIN - UPDATE STOCK
// ===============================

router.put(
  "/:id/stock",
  verifyToken,
  verifyAdmin,
  updateStock
);

// ===============================
// ADMIN - UPDATE LOW STOCK THRESHOLD
// ===============================

router.put(
  "/:id/threshold",
  verifyToken,
  verifyAdmin,
  updateThreshold
);

module.exports = router;