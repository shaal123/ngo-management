const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Supervisor = require("../models/Supervisor");

// Generate JWT token - now includes a "role" field so we know who is logged in
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// @route   POST /api/auth/login
// @desc    Unified login for both admin and supervisor
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // First check if it's an admin logging in
    let user = await Admin.findOne({ email });
    let role = "admin";

    // If not found as admin, check supervisors
    if (!user) {
      user = await Supervisor.findOne({ email }).populate("department", "name");
      role = "supervisor";
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if supervisor account is active
    if (role === "supervisor" && !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        // Include department info for supervisors so frontend can use it
        department: role === "supervisor" ? user.department : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/profile
// @desc    Get current logged-in user profile (admin or supervisor)
// @access  Private
const getAdminProfile = async (req, res, next) => {
  try {
    let user;
    if (req.user.role === "admin") {
      user = await Admin.findById(req.user.id).select("-password");
    } else {
      user = await Supervisor.findById(req.user.id)
        .select("-password")
        .populate("department", "name");
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: { ...user.toObject(), role: req.user.role },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginAdmin, getAdminProfile };
