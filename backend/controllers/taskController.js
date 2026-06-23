const Task = require("../models/Task");

// @route   GET /api/tasks
// @desc    Get tasks - admin sees all, supervisor sees only their department's tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    let filter = {};

    // Supervisors can only see tasks in their own department
    if (req.user.role === "supervisor") {
      filter.department = req.user.departmentId;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email") // show volunteer name
      .populate("department", "name")        // show department name
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (admin or supervisor)
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, assignedTo, department } = req.body;

    // Supervisors can only assign tasks within their own department
    if (req.user.role === "supervisor") {
      if (department !== req.user.departmentId?.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only assign tasks within your department",
        });
      }
    }

    const task = await Task.create({
      title, description, priority, dueDate, assignedTo, department,
      assignedBy: req.user.id,
      assignedByRole: req.user.role,
    });

    const populated = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("department", "name");

    res.status(201).json({ success: true, message: "Task created", data: populated });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update a task (status, priority, etc.)
// @access  Private (admin or supervisor who owns the task)
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Supervisor can only update tasks in their department
    if (req.user.role === "supervisor" &&
        task.department.toString() !== req.user.departmentId?.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate("assignedTo", "name email").populate("department", "name");

    res.status(200).json({ success: true, message: "Task updated", data: updated });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (admin only)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
