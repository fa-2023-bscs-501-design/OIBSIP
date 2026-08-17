const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        name: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          default: "",
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        emoji: {
          type: String,
          default: "🍕",
        },

        customization: {
          size: {
            type: String,
            default: "",
          },

          crust: {
            type: String,
            default: "",
          },

          sauce: {
            type: String,
            default: "",
          },

          cheese: {
            type: String,
            default: "",
          },

          toppings: {
            type: [String],
            default: [],
          },
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    // ===============================
    // PAYMENT
    // ===============================

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
      ],
      default: "Pending",
    },

    paymentId: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: [
        "Demo Payment",
        "Razorpay",
      ],
      default: "Demo Payment",
    },

    // ===============================
    // ORDER STATUS
    // ===============================

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);