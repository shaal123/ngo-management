const Volunteer = require("../models/Volunteer");
const Donor = require("../models/Donor");
const Task = require("../models/Task");
const Department = require("../models/Department");

// @route   GET /api/dashboard/stats
// @access  Private (admin sees all, supervisor sees their dept)
const getDashboardStats = async (req, res, next) => {
  try {
    const isSupervisor = req.user.role === "supervisor";
    const deptFilter = isSupervisor ? { department: req.user.departmentId } : {};

    const [totalVolunteers, totalDonors, activeVolunteers, donationAgg,
           totalTasks, pendingTasks, totalDepartments] = await Promise.all([
      Volunteer.countDocuments(deptFilter),
      isSupervisor ? Promise.resolve(0) : Donor.countDocuments(),
      Volunteer.countDocuments({ ...deptFilter, status: "Active" }),
      isSupervisor ? Promise.resolve([]) : Donor.aggregate([
        { $group: { _id: null, total: { $sum: "$donationAmount" } } },
      ]),
      Task.countDocuments(deptFilter),
      Task.countDocuments({ ...deptFilter, status: "Pending" }),
      isSupervisor ? Promise.resolve(0) : Department.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVolunteers,
        activeVolunteers,
        totalDonors,
        totalDonationAmount: donationAgg.length > 0 ? donationAgg[0].total : 0,
        totalTasks,
        pendingTasks,
        totalDepartments,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
