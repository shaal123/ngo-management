const Department = require("../models/Department");

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private (admin + supervisor)
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private (admin only)
const createDepartment = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const department = await Department.create({
      name,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json({ success: true, message: "Department created", data: department });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/departments/:id
// @desc    Update a department
// @access  Private (admin only)
const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, message: "Department updated", data: department });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/departments/:id
// @desc    Delete a department
// @access  Private (admin only)
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };
