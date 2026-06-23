const Volunteer = require("../models/Volunteer");

// @route   GET /api/volunteers
// @desc    Get all volunteers (supports optional search query)
// @access  Private
const getVolunteers = async (req, res, next) => {
  try {
    const { search } = req.query;

    // If a search term is provided, filter by name or email
    // The "i" option makes the search case-insensitive
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Sort by newest first
    const volunteers = await Volunteer.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/volunteers/:id
// @desc    Get a single volunteer by ID
// @access  Private
const getVolunteerById = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/volunteers
// @desc    Add a new volunteer
// @access  Private
const createVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.create(req.body);

    res.status(201).json({
      success: true,
      message: "Volunteer added successfully",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/volunteers/:id
// @desc    Update an existing volunteer
// @access  Private
const updateVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return the updated document
        runValidators: true, // re-run schema validation on update
      }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/volunteers/:id
// @desc    Delete a volunteer
// @access  Private
const deleteVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
