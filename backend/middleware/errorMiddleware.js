// Centralized error handler
// Any error thrown (or passed via next(error)) in our routes ends up here
// This keeps error responses consistent across the whole API
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Mongoose "CastError" usually means an invalid MongoDB ID was passed
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // Mongoose validation errors (e.g. required field missing)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // Duplicate key error (e.g. unique email already exists)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // Fallback for any other error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = errorHandler;
