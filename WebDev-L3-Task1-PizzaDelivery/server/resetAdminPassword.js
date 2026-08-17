require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
  dbName: "PizzaCraft",
});

    console.log("MongoDB connected");

    const email = "meerabasif04@gmail.com";
const newPassword = "Admin@123";

    // Find user without role restriction first
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      console.log("❌ User not found:", email);

      const allUsers = await User.find({}).select(
        "name email role"
      );

      console.log("Users found in this database:");

      allUsers.forEach((u) => {
        console.log({
          name: u.name,
          email: u.email,
          role: u.role,
        });
      });

      process.exit(1);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.role = "admin";
    user.isVerified = true;

    await user.save();

    console.log("=================================");
    console.log("✅ ADMIN PASSWORD RESET SUCCESS");
    console.log("Email:", user.email);
    console.log("Password:", newPassword);
    console.log("Role:", user.role);
    console.log("Verified:", user.isVerified);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetAdminPassword();