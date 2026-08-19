const { startLowStockJob } = require("./jobs/lowStockJob");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// =========================================================
// CORS + MIDDLEWARE
// =========================================================

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// =========================================================
// MONGODB CONNECTION
// =========================================================

const MONGO_URI = process.env.MONGO_URI;

let mongoConnectionPromise = null;

const connectMongoDB = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoConnectionPromise) {
    return mongoConnectionPromise;
  }

  console.log("🔗 Connecting to MongoDB...");

  mongoConnectionPromise = mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    })
    .then(() => {
      console.log("✅ MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("❌ MongoDB connection failed:", error.message);
      mongoConnectionPromise = null;
      throw error;
    });

  return mongoConnectionPromise;
};

// =========================================================
// DATABASE MIDDLEWARE
// =========================================================

const databaseMiddleware = async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: error.message,
    });
  }
};

// =========================================================
// BASIC TEST ROUTES
// =========================================================

app.get("/", async (req, res) => {
  try {
    await connectMongoDB();

    res.status(200).json({
      success: true,
      message: "PizzaCraft API is running 🍕",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "PizzaCraft API is running but MongoDB is not connected.",
      error: error.message,
    });
  }
});

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PizzaCraft serverless function is working",
  });
});

// =========================================================
// API ROUTES
// =========================================================

app.use("/api/auth", databaseMiddleware, authRoutes);
app.use("/api/orders", databaseMiddleware, orderRoutes);
app.use("/api/inventory", databaseMiddleware, inventoryRoutes);
app.use("/api/payment", databaseMiddleware, paymentRoutes);

// =========================================================
// 404
// =========================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================================================
// ERROR HANDLER
// =========================================================

app.use((err, req, res, next) => {
  console.error("EXPRESS ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : err.message,
  });
});

// =========================================================
// VERCEL
// =========================================================

module.exports = app;

// =========================================================
// LOCAL DEVELOPMENT
// =========================================================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, async () => {
    console.log(`🍕 PizzaCraft server running on port ${PORT}`);

    try {
      await connectMongoDB();

      console.log("✅ Local MongoDB connection ready");

      // Start low-stock email scheduler
      startLowStockJob();

      // Optional immediate test
      // const { checkLowStock } = require("./jobs/lowStockJob");
      // await checkLowStock();
    } catch (error) {
      console.error(
        "❌ Local MongoDB connection failed:",
        error.message
      );
    }
  });
}