const mongoose = require("mongoose");
const Inventory = require("../models/Inventory");

// ===============================
// GET ALL INVENTORY
// ===============================

const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({
      category: 1,
      name: 1,
    });

    return res.json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching inventory",
    });
  }
};

// ===============================
// ADD INVENTORY ITEM
// ===============================

const addInventoryItem = async (req, res) => {
  try {
    const {
      name,
      category,
      stock,
      lowStockThreshold,
    } = req.body;

    if (
      typeof name !== "string" ||
      typeof category !== "string" ||
      !name.trim() ||
      !category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();

    // Validate stock
    const stockValue =
      stock === undefined ? 0 : Number(stock);

    if (
      !Number.isFinite(stockValue) ||
      stockValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock value",
      });
    }

    // Validate threshold
    const thresholdValue =
      lowStockThreshold === undefined
        ? 20
        : Number(lowStockThreshold);

    if (
      !Number.isFinite(thresholdValue) ||
      thresholdValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid low stock threshold",
      });
    }

    const existingItem = await Inventory.findOne({
      name: {
        $regex: `^${trimmedName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}$`,
        $options: "i",
      },
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Inventory item already exists",
      });
    }

    const item = await Inventory.create({
      name: trimmedName,
      category: trimmedCategory,
      stock: stockValue,
      lowStockThreshold: thresholdValue,
    });

    return res.status(201).json({
      success: true,
      message: "Inventory item added successfully",
      item,
    });
  } catch (error) {
    console.error("Add inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding inventory item",
    });
  }
};

// ===============================
// UPDATE STOCK
// ===============================

const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory item ID",
      });
    }

    const stockValue = Number(stock);

    if (
      stock === undefined ||
      !Number.isFinite(stockValue) ||
      stockValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock value",
      });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        stock: stockValue,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    return res.json({
      success: true,
      message: "Stock updated successfully",
      item,
    });
  } catch (error) {
    console.error("Update stock error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating stock",
    });
  }
};

// ===============================
// UPDATE LOW STOCK THRESHOLD
// ===============================

const updateThreshold = async (req, res) => {
  try {
    const { lowStockThreshold } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory item ID",
      });
    }

    const thresholdValue =
      Number(lowStockThreshold);

    if (
      lowStockThreshold === undefined ||
      !Number.isFinite(thresholdValue) ||
      thresholdValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid threshold value",
      });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        lowStockThreshold: thresholdValue,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Low stock threshold updated successfully",
      item,
    });
  } catch (error) {
    console.error("Update threshold error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating low stock threshold",
    });
  }
};

module.exports = {
  getInventory,
  addInventoryItem,
  updateStock,
  updateThreshold,
};