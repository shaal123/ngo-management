const bcrypt = require("bcryptjs");
const Supervisor = require("../models/Supervisor");

// @route   GET /api/supervisors
// @desc    Get all supervisors (admin only)
// @access  Private (admin)
const getSupervisors = async (req, res, next) => {
  try {
    const supervisors = await Supervisor.find()
      .select("-password") // never send password hash to frontend
      .populate("department", "name") // replace department ID with its name
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: supervisors.length, data: supervisors });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/supervisors
// @desc    Create a new supervisor account
// @access  Private (admin only)
const createSupervisor = async (req, res, next) => {
  try {
    const { name, email, password, phone, department } = req.body;

    // Check if email is already taken
    const existing = await Supervisor.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const supervisor = await Supervisor.create({
      name, email, phone, department,
      password: hashedPassword,
    });

    // Don't return the password hash in the response
    const result = await Supervisor.findById(supervisor._id)
      .select("-password")
      .populate("department", "name");

    res.status(201).json({ success: true, message: "Supervisor created successfully", data: result });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/supervisors/:id
// @desc    Update supervisor details (not password)
// @access  Private (admin only)
const updateSupervisor = async (req, res, next) => {
  try {
    // Prevent password from being updated via this route
    const { password, ...updateData } = req.body;

    const supervisor = await Supervisor.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
    }).select("-password").populate("department", "name");

    if (!supervisor) {
      return res.status(404).json({ success: false, message: "Supervisor not found" });
    }

    res.status(200).json({ success: true, message: "Supervisor updated", data: supervisor });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/supervisors/:id
// @desc    Delete a supervisor
// @access  Private (admin only)
const deleteSupervisor = async (req, res, next) => {
  try {
    const supervisor = await Supervisor.findByIdAndDelete(req.params.id);
    if (!supervisor) {
      return res.status(404).json({ success: false, message: "Supervisor not found" });
    }
    res.status(200).json({ success: true, message: "Supervisor deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSupervisors, createSupervisor, updateSupervisor, deleteSupervisor };
