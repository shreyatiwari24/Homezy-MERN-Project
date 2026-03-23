const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { updateProfile } = require("../controllers/userController");
const { changePassword } = require("../controllers/userController");
const bcrypt = require("bcryptjs");

/* ================================
   PROTECTED ROUTES
================================ */

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);



module.exports = router;
