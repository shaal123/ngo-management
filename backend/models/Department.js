const mongoose = require("mongoose");

// Department schema - admin creates departments like "Education", "Health" etc.
// Volunteers are assigned to departments, tasks belong to departments
const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    // Which admin created this department (reference to Admin collection)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
