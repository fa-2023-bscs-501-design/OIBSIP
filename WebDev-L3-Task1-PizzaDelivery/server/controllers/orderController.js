const mongoose = require("mongoose");
const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

// ===============================
// CREATE ORDER
// ===============================

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      items,
      totalAmount,
      paymentStatus,
      paymentId,
      paymentMethod,
    } = req.body;

    // ===============================
    // VALIDATE ORDER
    // ===============================

    if (!Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (
      typeof totalAmount !== "number" ||
      totalAmount <= 0
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Invalid order total",
      });
    }

    // ===============================
    // CALCULATE INVENTORY REQUIREMENTS
    // ===============================

    const inventoryRequirements = {};

    for (const item of items) {
      const quantity = Number(item.quantity) || 0;

      if (quantity <= 0) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: "Invalid item quantity",
        });
      }

      const customization =
        item.customization || {};

      // ===============================
      // BASE
      // ===============================

      const baseName =
        customization.crust === "Thin Crust"
          ? "Thin Crust Base"
          : customization.crust === "Cheese Burst"
          ? "Cheese Burst Base"
          : "Classic Pizza Base";

      // ===============================
      // SAUCE
      // ===============================

      const sauceName =
        customization.sauce === "BBQ Sauce"
          ? "BBQ Sauce"
          : customization.sauce === "Creamy Garlic"
          ? "Spicy Garlic Sauce"
          : "Tomato Sauce";

      // ===============================
      // CHEESE
      // ===============================

      const cheeseName =
        customization.cheese === "Cheddar Blend"
          ? "Cheddar"
          : customization.cheese === "Extra Cheese"
          ? "Four Cheese"
          : "Mozzarella";

      // ===============================
      // ADD BASE REQUIREMENT
      // ===============================

      inventoryRequirements[baseName] =
        (inventoryRequirements[baseName] || 0) +
        quantity;

      // ===============================
      // ADD SAUCE REQUIREMENT
      // ===============================

      inventoryRequirements[sauceName] =
        (inventoryRequirements[sauceName] || 0) +
        quantity;

      // ===============================
      // ADD CHEESE REQUIREMENT
      // ===============================

      inventoryRequirements[cheeseName] =
        (inventoryRequirements[cheeseName] || 0) +
        quantity;

      // ===============================
      // TOPPINGS
      // ===============================

      if (
        customization.toppings &&
        Array.isArray(customization.toppings)
      ) {
        for (const topping of customization.toppings) {
          let inventoryName = topping;

          if (topping === "Chicken") {
            inventoryName = "Chicken";
          }

          if (topping === "Pepperoni") {
            inventoryName = "Pepperoni";
          }

          if (topping === "Mushrooms") {
            inventoryName = "Mushrooms";
          }

          if (topping === "Olives") {
            inventoryName = "Olives";
          }

          if (topping === "Jalapeños") {
            inventoryName = "Jalapeños";
          }

          if (topping === "Onions") {
            inventoryName = "Onions";
          }

          if (topping === "Bell Peppers") {
            inventoryName = "Bell Peppers";
          }

          inventoryRequirements[inventoryName] =
            (inventoryRequirements[inventoryName] || 0) +
            quantity;
        }
      }
    }

    // ===============================
    // CHECK AVAILABLE STOCK
    // ===============================

    for (const [
      itemName,
      requiredQuantity,
    ] of Object.entries(inventoryRequirements)) {
      const inventoryItem =
        await Inventory.findOne({
          name: itemName,
        }).session(session);

      if (!inventoryItem) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `Inventory item "${itemName}" not found`,
        });
      }

      if (
        inventoryItem.stock <
        requiredQuantity
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${itemName}. Available: ${inventoryItem.stock}`,
        });
      }
    }

    // ===============================
    // DECREASE INVENTORY
    // ===============================

    for (const [
      itemName,
      requiredQuantity,
    ] of Object.entries(inventoryRequirements)) {
      const updatedInventory =
        await Inventory.findOneAndUpdate(
          {
            name: itemName,
            stock: {
              $gte: requiredQuantity,
            },
          },
          {
            $inc: {
              stock: -requiredQuantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedInventory) {
        throw new Error(
          `Stock changed while placing order for ${itemName}`
        );
      }
    }

    // ===============================
    // CREATE ORDER
    // ===============================

   const createdOrders = await Order.create(
  [
    {
      user: req.user.userId,
      items,
      totalAmount,

      // ===============================
      // PAYMENT
      // ===============================
      paymentStatus: "Paid",
      paymentId: req.body.paymentId || "",
      paymentMethod: req.body.paymentMethod || "Demo Payment",

      // ===============================
      // ORDER STATUS
      // ===============================
      status: "Pending",
    },
  ],
  {
    session,
  }
);

            // ===============================
            // PAYMENT DETAILS
            // ===============================


    const order = createdOrders[0];

    // ===============================
    // COMMIT TRANSACTION
    // ===============================

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    // ===============================
    // ROLLBACK TRANSACTION
    // ===============================

    try {
      await session.abortTransaction();
    } catch (abortError) {
      console.error(
        "Transaction rollback error:",
        abortError
      );
    }

    console.error(
      "Order creation transaction error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating order",
    });
  } finally {
    await session.endSession();
  }
};

// ===============================
// GET MY ORDERS
// ===============================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching orders",
    });
  }
};

// ===============================
// ADMIN - GET ALL ORDERS
// ===============================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Admin get orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching orders",
    });
  }
};

// ===============================
// ADMIN - UPDATE ORDER STATUS
// ===============================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "name email"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating order status",
    });
  }
};

// ===============================
// EXPORTS
// ===============================

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};