const express = require("express");
const router = express.Router();

const {
  createBooking,
  updateBookingStatus,
  getCustomerBookings,
  getProviderBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middlewares/authMiddleware");

/* =========================
   CUSTOMER ROUTES
========================= */

// Create booking
router.post("/", protect, authorize("customer"), createBooking);

// Get customer bookings
router.get("/my-bookings", protect, authorize("customer"), getCustomerBookings);

// Cancel booking
router.patch("/:id/cancel", protect, authorize("customer"), cancelBooking);

/* =========================
   PROVIDER ROUTES
========================= */

// ✅ Single consistent route — matches both ProviderDashboard and ProviderBookings
router.get(
  "/provider-bookings",
  protect,
  authorize("provider"),
  getProviderBookings
);

// Update booking status
router.patch(
  "/:id/status",
  protect,
  authorize("provider"),
  updateBookingStatus
);

module.exports = router;