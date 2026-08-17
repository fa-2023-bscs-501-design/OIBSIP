const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const Inventory = require("./models/Inventory");

const app = express();

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// =========================================================
// MONGODB CONNECTION
// =========================================================

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
} else {
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("❌ MongoDB connection failed");
      console.error("Error:", error.message);
    });
}

// =========================================================
// PAYMENT ROUTES
// =========================================================

app.use("/api/payment", paymentRoutes);

// =========================================================
// TEST ROUTE
// =========================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PizzaCraft API is running 🍕",
  });
});

// =========================================================
// API ROUTES
// =========================================================

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);

// =========================================================
// INVENTORY SETUP
// =========================================================

app.get("/api/setup-inventory", async (req, res) => {
  try {
    const items = [
      {
        name: "Classic Pizza Base",
        category: "Pizza Base",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "Thin Crust Base",
        category: "Pizza Base",
        stock: 80,
        lowStockThreshold: 20,
      },
      {
        name: "Cheese Burst Base",
        category: "Pizza Base",
        stock: 60,
        lowStockThreshold: 20,
      },
      {
        name: "Tomato Sauce",
        category: "Sauce",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "BBQ Sauce",
        category: "Sauce",
        stock: 80,
        lowStockThreshold: 20,
      },
      {
        name: "Spicy Garlic Sauce",
        category: "Sauce",
        stock: 70,
        lowStockThreshold: 20,
      },
      {
        name: "Mozzarella",
        category: "Cheese",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "Cheddar",
        category: "Cheese",
        stock: 80,
        lowStockThreshold: 20,
      },
      {
        name: "Four Cheese",
        category: "Cheese",
        stock: 60,
        lowStockThreshold: 20,
      },
      {
        name: "Pepperoni",
        category: "Vegetable",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "Mushrooms",
        category: "Vegetable",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "Olives",
        category: "Vegetable",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "Jalapeños",
        category: "Vegetable",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "Onions",
        category: "Vegetable",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "Bell Peppers",
        category: "Vegetable",
        stock: 100,
        lowStockThreshold: 20,
      },
      {
        name: "Chicken",
        category: "Chicken",
        stock: 100,
        lowStockThreshold: 20,
      },
    ];

    let added = 0;

    for (const item of items) {
      const exists = await Inventory.findOne({
        name: item.name,
      });

      if (!exists) {
        await Inventory.create(item);
        added++;
      }
    }

    return res.json({
      success: true,
      message: `${added} inventory items added successfully.`,
    });
  } catch (error) {
    console.error("Inventory setup error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to setup inventory.",
    });
  }
});

// =========================================================
// VERCEL EXPORT
// =========================================================

module.exports = app;

// =========================================================
// LOCAL DEVELOPMENT
// =========================================================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🍕 PizzaCraft server running on port ${PORT}`);
  });
}