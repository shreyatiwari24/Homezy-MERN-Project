const express = require("express");
const router = express.Router();

const {
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getDashboardStats,
  getPendingServices,
  approveService,
  rejectService,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middlewares/authMiddleware");

/* ================= DASHBOARD ================= */
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);

/* ================= PROVIDER MANAGEMENT ================= */
router.get(
  "/providers/pending",
  protect,
  authorize("admin"),
  getPendingProviders
);

router.patch(
  "/providers/:id/approve",
  protect,
  authorize("admin"),
  approveProvider
);

router.patch(
  "/providers/:id/reject",
  protect,
  authorize("admin"),
  rejectProvider
);

/* ================= SERVICE MANAGEMENT ================= */
router.get(
  "/services/pending",
  protect,
  authorize("admin"),
  getPendingServices
);

router.patch(
  "/services/:id/approve",
  protect,
  authorize("admin"),
  approveService
);

router.patch(
  "/services/:id/reject",
  protect,
  authorize("admin"),
  rejectService
);

module.exports = router;