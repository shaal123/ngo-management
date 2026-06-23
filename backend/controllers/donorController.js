const Donor = require("../models/Donor");

// @route   GET /api/donors
// @desc    Get all donors (supports optional search query)
// @access  Private
const getDonors = async (req, res, next) => {
  try {
    const { search } = req.query;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const donors = await Donor.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/donors/:id
// @desc    Get a single donor by ID
// @access  Private
const getDonorById = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/donors
// @desc    Add a new donor
// @access  Private
const createDonor = async (req, res, next) => {
  try {
    const donor = await Donor.create(req.body);

    res.status(201).json({
      success: true,
      message: "Donor added successfully",
      data: donor,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/donors/:id
// @desc    Update an existing donor
// @access  Private
const updateDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donor updated successfully",
      data: donor,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/donors/:id
// @desc    Delete a donor
// @access  Private
const deleteDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Donor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor,
};
