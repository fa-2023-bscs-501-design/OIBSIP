const express = require("express");

const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// ===============================
// USER AUTH
// ===============================

router.post("/register", register);

router.post("/login", login);

// ===============================
// EMAIL VERIFICATION
// ===============================

// Email link format:
// /verify-email?token=YOUR_TOKEN
router.get("/verify-email", verifyEmail);

router.post(
  "/resend-verification",
  resendVerificationEmail
);

// ===============================
// PASSWORD RESET
// ===============================

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

module.exports = router;