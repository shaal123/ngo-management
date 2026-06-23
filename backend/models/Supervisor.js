const mongoose = require("mongoose");

// Supervisor schema - supervisors are created by the admin
// They can log in and assign tasks to volunteers in their department
const supervisorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supervisor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // Always stored as a bcrypt hash, never plain text
    },
    phone: {
      type: String,
      default: "",
    },
    // Each supervisor belongs to one department
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supervisor", supervisorSchema);
