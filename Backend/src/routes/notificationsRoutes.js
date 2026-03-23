const express = require("express");
const router = express.Router();

const {
  getUserNotifications,
  markAsRead
} = require("../controllers/notificationsController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getUserNotifications);

router.patch("/:id/read", protect, markAsRead);

module.exports = router;