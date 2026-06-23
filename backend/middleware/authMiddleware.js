const jwt = require("jsonwebtoken");

// Generic middleware - allows BOTH admin and supervisor tokens
// Attaches decoded user info + role to req.user
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded will contain { id, role: "admin" | "supervisor", ... }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid or expired",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

// Admin-only middleware - blocks supervisors from admin-only routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
};

// Supervisor or admin - both can access these routes
const supervisorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "supervisor")) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }
};

module.exports = { protect, adminOnly, supervisorOrAdmin };
