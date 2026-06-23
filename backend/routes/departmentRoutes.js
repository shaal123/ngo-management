const express = require("express");
const router = express.Router();
const {
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
} = require("../controllers/departmentController");
const { protect, adminOnly, supervisorOrAdmin } = require("../middleware/authMiddleware");

// Both admin and supervisor can view departments (supervisor needs to see department list)
router.get("/", protect, supervisorOrAdmin, getDepartments);

// Only admin can create, update, delete departments
router.post("/", protect, adminOnly, createDepartment);
router.put("/:id", protect, adminOnly, updateDepartment);
router.delete("/:id", protect, adminOnly, deleteDepartment);

module.exports = router;
