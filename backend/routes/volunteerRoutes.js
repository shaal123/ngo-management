const express = require("express");
const router = express.Router();
const {
  getVolunteers, getVolunteerById, createVolunteer, updateVolunteer, deleteVolunteer,
} = require("../controllers/volunteerController");
const { protect, supervisorOrAdmin, adminOnly } = require("../middleware/authMiddleware");

// Both admin and supervisor can view and create volunteers
router.route("/").get(protect, supervisorOrAdmin, getVolunteers).post(protect, adminOnly, createVolunteer);
router.route("/:id")
  .get(protect, supervisorOrAdmin, getVolunteerById)
  .put(protect, adminOnly, updateVolunteer)
  .delete(protect, adminOnly, deleteVolunteer);

module.exports = router;
