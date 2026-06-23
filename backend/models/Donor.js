const mongoose = require("mongoose");

// Donor schema - represents one donor record along with their donation info
const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Donor name is required"],
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
    donationAmount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [0, "Donation amount cannot be negative"],
    },
    donationDate: {
      type: Date,
      required: [true, "Donation date is required"],
      default: Date.now,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Cheque", "Other"],
      default: "Cash",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);
