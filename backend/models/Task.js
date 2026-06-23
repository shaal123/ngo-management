const mongoose = require("mongoose");

// Task schema - detailed tasks assigned to volunteers by supervisors or admin
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    // The volunteer this task is assigned to
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: [true, "Assigned volunteer is required"],
    },
    // Which department this task belongs to
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    // Who created the task - could be admin OR supervisor
    // We store both the ID and the role so we know which collection to look in
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    assignedByRole: {
      type: String,
      enum: ["admin", "supervisor"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
