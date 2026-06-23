const mongoose = require("mongoose");

// Volunteer schema - represents one volunteer record
const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Volunteer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    skills: {
      type: String, // kept simple as a comma-separated string, e.g. "Teaching, Cooking"
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"], // restricts value to only these two options
      default: "Active",
    },
    // Department this volunteer belongs to (optional - can be unassigned)
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
