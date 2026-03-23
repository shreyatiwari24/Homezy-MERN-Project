const express = require("express");
const router = express.Router();

const {
  createReview,
  getMyReviews,
  getServiceReviews,
  getProviderReviews,
} = require("../controllers/reviewController");

const { protect, authorize } = require("../middlewares/authMiddleware");

/* =====================================================
   CUSTOMER ROUTES (Authenticated)
===================================================== */

// Create a review (REST standard)
router.post(
  "/",
  protect,
  authorize("customer"),
  createReview
);

// Get logged-in user's reviews
router.get(
  "/my",
  protect,
  authorize("customer"),
  getMyReviews
);

/* =====================================================
   PUBLIC ROUTES (No auth required)
===================================================== */

// Get reviews for a specific service
router.get("/service/:serviceId", getServiceReviews);

// Get reviews for a specific provider
router.get("/provider/:providerId", getProviderReviews);

module.exports = router;