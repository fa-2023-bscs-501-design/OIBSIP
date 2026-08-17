const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");

// =========================================================
// EMAIL TRANSPORTER
// =========================================================

const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error(
      "Email configuration is missing. Please check EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS in .env"
    );
  }

  return nodemailer.createTransport({
    host,
    port,

    // Port 465 = SSL
    // Port 587 = STARTTLS
    secure: port === 465,

    auth: {
      user,
      pass,
    },

    tls: {
      rejectUnauthorized: false,
    },
  });
};

// =========================================================
// VERIFY EMAIL CONNECTION
// =========================================================

const verifyEmailTransporter = async () => {
  const transporter = createTransporter();

  try {
    await transporter.verify();

    console.log("✅ Email transporter is ready.");
  } catch (error) {
    console.error(
      "❌ Email transporter verification failed:"
    );

    console.error(error.message);

    throw new Error(
      `Email service connection failed: ${error.message}`
    );
  }

  return transporter;
};

// =========================================================
// SEND VERIFICATION EMAIL
// =========================================================

const sendVerificationEmail = async (user, verificationToken) => {
  try {
    console.log("========================================");
    console.log("📧 VERIFICATION EMAIL START");
    console.log("📧 To:", user.email);

    const transporter = await verifyEmailTransporter();

    const frontendUrl =
      process.env.CLIENT_URL || "http://localhost:5173";

    const verificationLink =
      `${frontendUrl}/verify-email?token=${verificationToken}`;

    console.log("📧 Verification link:", verificationLink);
    console.log("📧 From:", process.env.EMAIL_FROM || process.env.EMAIL_USER);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify your PizzaCraft account 🍕",

      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family:Arial,sans-serif;background:#f7f3ef;padding:30px;">

          <div style="
            max-width:600px;
            margin:auto;
            background:white;
            padding:40px;
            border-radius:16px;
          ">

            <h1 style="color:#e85d04;">
              Welcome to PizzaCraft 🍕
            </h1>

            <p>
              Hi <strong>${user.name}</strong>,
            </p>

            <p>
              Thanks for creating your PizzaCraft account.
              Please verify your email address.
            </p>

            <p style="margin:30px 0;">
              <a
                href="${verificationLink}"
                style="
                  display:inline-block;
                  padding:14px 24px;
                  background:#e85d04;
                  color:white;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Verify My Email
              </a>
            </p>

            <p>
              This verification link will expire in
              <strong>24 hours</strong>.
            </p>

            <p style="color:#756963;">
              If you did not create this account,
              you can safely ignore this email.
            </p>

            <hr>

            <p style="color:#756963;">
              PizzaCraft — Fresh pizzas, bold flavours 🍕
            </p>

          </div>

        </body>
        </html>
      `,
    });

    console.log("========================================");
    console.log("✅ VERIFICATION EMAIL ACCEPTED BY SMTP");
    console.log("📧 Message ID:", info.messageId);
    console.log("📧 Accepted:", info.accepted);
    console.log("📧 Rejected:", info.rejected);
    console.log("📧 Response:", info.response);
    console.log("========================================");

    return info;

  } catch (error) {
    console.log("========================================");
    console.error("❌ VERIFICATION EMAIL FAILED");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("Response:", error.response);
    console.error("Response Code:", error.responseCode);
    console.log("========================================");

    throw error;
  }
};
// =========================================================
// SEND PASSWORD RESET EMAIL
// =========================================================

// ===============================
// SEND PASSWORD RESET EMAIL
// ===============================

const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    console.log("📧 Starting password reset email...");

    console.log("📧 Email config:", {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
        ? "LOADED"
        : "MISSING",
    });

    const transporter = createTransporter();

    console.log("📧 Testing SMTP connection...");

    await transporter.verify();

    console.log("✅ SMTP connection successful");

    const frontendUrl =
      process.env.CLIENT_URL ||
      "http://localhost:5173";

    const resetLink =
      `${frontendUrl}/reset-password?token=${resetToken}`;

    console.log(
      "📧 Reset link:",
      resetLink
    );

    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        process.env.EMAIL_USER,

      to: user.email,

      subject:
        "Reset your PizzaCraft password 🍕",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          background: #fffaf5;
          color: #241a17;
        ">

          <h1 style="color: #e85d04;">
            PizzaCraft Password Reset 🍕
          </h1>

          <p>
            Hi <strong>${user.name}</strong>,
          </p>

          <p>
            We received a request to reset your
            PizzaCraft account password.
          </p>

          <div style="margin: 30px 0;">

            <a
              href="${resetLink}"
              style="
                display: inline-block;
                padding: 14px 24px;
                background: #e85d04;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Reset My Password
            </a>

          </div>

          <p>
            This reset link will expire in
            <strong>1 hour</strong>.
          </p>

          <p style="color: #756963;">
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <hr />

          <p style="color: #756963;">
            PizzaCraft — Fresh pizzas, bold flavours 🍕
          </p>

        </div>
      `,
    });

    console.log(
      "✅ PASSWORD RESET EMAIL SENT:",
      info.messageId
    );

    return info;

  } catch (error) {

    console.error(
      "❌ PASSWORD RESET EMAIL ERROR:"
    );

    console.error(
      "Name:",
      error.name
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Code:",
      error.code
    );

    console.error(
      "Command:",
      error.command
    );

    console.error(
      "Response:",
      error.response
    );

    throw error;
  }
};

// =========================================================
// REGISTER
// =========================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all fields.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const trimmedName =
      name.trim();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid name.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const verificationExpires =
      new Date(
        Date.now() +
          24 * 60 * 60 * 1000
      );

    const user =
      await User.create({
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user",
        isVerified: false,

        emailVerificationToken:
          verificationToken,

        emailVerificationExpires:
          verificationExpires,
      });

    try {
      await sendVerificationEmail(
        user,
        verificationToken
      );
    } catch (emailError) {
      console.error(
        "❌ Verification email error:"
      );

      console.error(
        emailError.message
      );

      await User.findByIdAndDelete(
        user._id
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send verification email. Please check your email configuration.",
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during registration.",
    });
  }
};

// =========================================================
// VERIFY EMAIL
// =========================================================

// =========================================================
// VERIFY EMAIL
// =========================================================

const verifyEmail = async (req, res) => {
  try {
    // Email link:
    // /verify-email?token=xxxxx
    //
    // So token comes from req.query.token

    const token = req.query.token || req.params.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required.",
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or has expired.",
      });
    }

    // ==========================================
    // MARK EMAIL AS VERIFIED
    // ==========================================

    user.isVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully. You can now login.",
      user: {
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during email verification.",
    });
  }
};
// =========================================================
// RESEND VERIFICATION EMAIL
// =========================================================

const resendVerificationEmail =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message:
            "Email is required.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const user =
        await User.findOne({
          email: normalizedEmail,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Account not found.",
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message:
            "This email is already verified.",
        });
      }

      const verificationToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      user.emailVerificationToken =
        verificationToken;

      user.emailVerificationExpires =
        new Date(
          Date.now() +
            24 * 60 * 60 * 1000
        );

      await user.save();

      await sendVerificationEmail(
        user,
        verificationToken
      );

      return res.json({
        success: true,
        message:
          "A new verification email has been sent.",
      });
    } catch (error) {
      console.error(
        "Resend verification error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to resend verification email.",
      });
    }
  };

// =========================================================
// LOGIN
// =========================================================

const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter email and password.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    if (
      user.role !== "admin" &&
      !user.isVerified
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in.",
        emailVerified: false,
      });
    }

    const token =
      jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    return res.json({
      success: true,
      message:
        "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified:
          user.isVerified,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login.",
    });
  }
};

// =========================================================
// FORGOT PASSWORD
// =========================================================

const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } =
      req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your email address.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    /*
      Security:
      We don't reveal whether
      the email exists or not.
    */

    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    const resetExpires =
      new Date(
        Date.now() +
          60 * 60 * 1000
      );

    user.passwordResetToken =
      resetToken;

    user.passwordResetExpires =
      resetExpires;

    await user.save();

    try {
      await sendPasswordResetEmail(
        user,
        resetToken
      );
    } catch (emailError) {
      console.error(
        "❌ PASSWORD RESET EMAIL ERROR"
      );

      console.error(
        emailError.message
      );

      /*
        Remove token if email
        could not be sent.
      */

      user.passwordResetToken =
        null;

      user.passwordResetExpires =
        null;

      await user.save();

      return res.status(500).json({
        success: false,
        message:
          `Password reset email could not be sent. ${emailError.message}`,
      });
    }

    return res.json({
      success: true,
      message:
        "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request.",
    });
  }
};

// =========================================================
// RESET PASSWORD
// =========================================================

const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      token,
    } = req.params;

    const {
      password,
    } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "New password is required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const user =
      await User.findOne({
        passwordResetToken:
          token,

        passwordResetExpires: {
          $gt: new Date(),
        },
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset link is invalid or has expired.",
      });
    }

    user.password =
      await bcrypt.hash(
        password,
        10
      );

    user.passwordResetToken =
      null;

    user.passwordResetExpires =
      null;

    await user.save();

    return res.json({
      success: true,
      message:
        "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while resetting password.",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
};