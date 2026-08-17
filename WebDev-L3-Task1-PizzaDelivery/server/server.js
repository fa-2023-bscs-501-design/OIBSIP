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

let mongoConnectionPromise = null;

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      }
    );
  }

  try {
    await mongoConnectionPromise;

    console.log("✅ MongoDB connected successfully");

    return mongoose.connection;
  } catch (error) {
    mongoConnectionPromise = null;

    console.error("❌ MongoDB connection failed:");
    console.error(error.message);

    throw error;
  }
};

// =========================================================
// ROOT TEST ROUTE
// =========================================================

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "PizzaCraft API is running 🍕",
  });
});

// =========================================================
// DATABASE HEALTH CHECK
// =========================================================

app.get("/api/health", async (req, res) => {
  try {
    await connectMongoDB();

    return res.json({
      success: true,
      message: "PizzaCraft API and MongoDB are working.",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check error:", error);

    return res.status(500).json({
      success: false,
      message: "MongoDB connection failed.",
      error: error.message,
    });
  }
});

// =========================================================
// PAYMENT ROUTES
// =========================================================

app.use("/api/payment", paymentRoutes);

// =========================================================
// AUTH ROUTES
// =========================================================

app.use("/api/auth", authRoutes);

// =========================================================
// ORDER ROUTES
// =========================================================

app.use("/api/orders", orderRoutes);

// =========================================================
// INVENTORY ROUTES
// =========================================================

app.use("/api/inventory", inventoryRoutes);

// =========================================================
// INVENTORY SETUP
// =========================================================

app.get("/api/setup-inventory", async (req, res) => {
  try {
    await connectMongoDB();

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
      error: error.message,
    });
  }
});

// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================================================
// GLOBAL ERROR HANDLER
// =========================================================

app.use((error, req, res, next) => {
  console.error("========================================");
  console.error("GLOBAL SERVER ERROR");
  console.error("Name:", error.name);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);
  console.error("========================================");

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
    error: error.message,
  });
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

  connectMongoDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `🍕 PizzaCraft server running on port ${PORT}`
        );
      });
    })
    .catch((error) => {
      console.error(
        "❌ Server could not start:",
        error.message
      );

      process.exit(1);
    });
}