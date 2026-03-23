const express = require("express");
const router = express.Router();

const {
  createProviderProfile,
  getProviderDashboard,
  updateProviderProfile,
  deleteProviderProfile,
  getProviderProfile,
  getProviderAnalytics,
  getNearbyProviders,
} = require("../controllers/providerController");

const {
  protect,
  authorize,
} = require("../middlewares/authMiddleware");

const {
  validateProviderProfile,
} = require("../middlewares/providerValidation");


// Create provider profile
router.post(
  "/",
  protect,
  authorize("provider"),
  validateProviderProfile,
  createProviderProfile
);

// Get provider profile
router.get(
  "/profile",
  protect,
  authorize("provider"),
  getProviderProfile
);

// Update provider profile
router.put(
  "/profile",
  protect,
  authorize("provider"),
  validateProviderProfile,
  updateProviderProfile
);

// Delete provider profile
router.delete(
  "/profile",
  protect,
  authorize("provider"),
  deleteProviderProfile
);

// Provider dashboard
router.get(
  "/dashboard",
  protect,
  authorize("provider"),
  getProviderDashboard
);

// Provider analytics
router.get(
  "/analytics",
  protect,
  authorize("provider"),
  getProviderAnalytics
);

router.get("/nearby", protect, getNearbyProviders);

module.exports = router;