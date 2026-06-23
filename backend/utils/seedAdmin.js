// This script creates ONE admin account in the database.
// Run it once (npm run seed) before you start using the app.
// It reads the email/password from your .env file so you never hardcode
// credentials directly in the codebase.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists. No action taken.");
      process.exit(0);
    }

    // Hash the password before saving - never store plain text passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    await Admin.create({
      name: "NGO Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("Admin account created successfully!");
    console.log(`Email: ${process.env.ADMIN_EMAIL}`);
    console.log("You can now log in using these credentials.");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
