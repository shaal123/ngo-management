const express = require("express");
const router = express.Router();
const {
  getDonors, getDonorById, createDonor, updateDonor, deleteDonor,
} = require("../controllers/donorController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect);
router.route("/").get(adminOnly, getDonors).post(adminOnly, createDonor);
router.route("/:id")
  .get(adminOnly, getDonorById)
  .put(adminOnly, updateDonor)
  .delete(adminOnly, deleteDonor);

module.exports = router;
