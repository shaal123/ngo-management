const mongoose = require("mongoose");

// Admin schema - we only ever have ONE admin account in this project
// (created once via the seed script, not through a public register API)
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // Password is stored as a bcrypt hash, never as plain text
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Admin", adminSchema);
