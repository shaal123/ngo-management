const express = require("express");
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { protect, supervisorOrAdmin, adminOnly } = require("../middleware/authMiddleware");

// Both admin and supervisor can view, create, update tasks
router.get("/", protect, supervisorOrAdmin, getTasks);
router.post("/", protect, supervisorOrAdmin, createTask);
router.put("/:id", protect, supervisorOrAdmin, updateTask);

// Only admin can delete tasks
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;
