const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pizzacraft-delta.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

app.options(/.*/, cors());
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

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Connection already in progress
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
      console.error("❌ MongoDB connection failed");
      console.error("Name:", error.name);
      console.error("Message:", error.message);
      console.error("Code:", error.code);

      mongoConnectionPromise = null;

      throw error;
    });

  return mongoConnectionPromise;
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
// LOAD ROUTES
// =========================================================

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("AUTH DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: error.message,
    });
  }
}, authRoutes);

app.use("/api/orders", async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("ORDER DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: error.message,
    });
  }
}, orderRoutes);

app.use("/api/inventory", async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("INVENTORY DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: error.message,
    });
  }
}, inventoryRoutes);

app.use("/api/payment", async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("PAYMENT DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: error.message,
    });
  }
}, paymentRoutes);

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

  app.listen(PORT, () => {
    console.log(`🍕 PizzaCraft server running on port ${PORT}`);

    connectMongoDB()
      .then(() => {
        console.log("✅ Local MongoDB connection ready");
      })
      .catch((error) => {
        console.error(
          "❌ Local MongoDB connection failed:",
          error.message
        );
      });
  });
}