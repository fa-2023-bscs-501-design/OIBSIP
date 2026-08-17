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

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required",
      });
    }

    const existingItem = await Inventory.findOne({
      name: name.trim(),
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Inventory item already exists",
      });
    }

    const item = await Inventory.create({
      name: name.trim(),
      category,
      stock: Number(stock) || 0,
      lowStockThreshold:
        lowStockThreshold !== undefined
          ? Number(lowStockThreshold)
          : 20,
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
      stock === undefined ||
      Number.isNaN(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock value",
      });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        stock: Number(stock),
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
      lowStockThreshold === undefined ||
      Number.isNaN(Number(lowStockThreshold)) ||
      Number(lowStockThreshold) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid threshold value",
      });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        lowStockThreshold: Number(lowStockThreshold),
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
      message: "Low stock threshold updated successfully",
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