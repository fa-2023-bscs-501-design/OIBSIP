// ===============================
// DEMO PAYMENT CONTROLLER
// ===============================

// Razorpay temporarily disabled because
// Razorpay account/API keys are not available yet.

// ===============================
// CREATE PAYMENT ORDER
// ===============================

const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const numericAmount = Number(amount);

    // Demo payment order
    // This allows us to test the complete checkout flow
    // without requiring Razorpay credentials.

    const order = {
      id: `demo_order_${Date.now()}`,
      amount: Math.round(numericAmount * 100),
      currency: "PKR",
      status: "created",
      payment_method: "Demo Payment",
    };

    return res.status(201).json({
      success: true,
      message: "Demo payment order created",
      order,
    });
  } catch (error) {
    console.error("Payment order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

module.exports = {
  createPaymentOrder,
};