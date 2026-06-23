const express = require("express");
const router = express.Router();
const {
  getSupervisors, createSupervisor, updateSupervisor, deleteSupervisor,
} = require("../controllers/supervisorController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All supervisor management routes are admin-only
router.use(protect, adminOnly);
router.route("/").get(getSupervisors).post(createSupervisor);
router.route("/:id").put(updateSupervisor).delete(deleteSupervisor);

module.exports = router;
