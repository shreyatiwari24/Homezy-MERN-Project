const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createService,
  getAllServices,
  updateService,
  getServiceById,
  getServicesByCategory,
  getCategories
} = require("../controllers/serviceController");

const { protect, authorize } = require("../middlewares/authMiddleware");
const providerVerified = require("../middlewares/providerVerified");


/* =========================
   CREATE SERVICE
========================= */
router.post(
  "/",
  protect,
  authorize("provider"),
  providerVerified,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("category").notEmpty().withMessage("Category is required")
  ],
  createService
);


/* =========================
   PROVIDER SERVICES
========================= */
router.get(
  "/my-services",
  protect,
  authorize("provider"),
  async (req, res) => {
    try {
      const filter = {
        provider: req.user._id
      };

      if (req.query.status) {
        filter.status = req.query.status;
      }

      const services = await require("../models/Service")
        .find(filter)
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        services
      });

    } catch (error) {
      console.error("MY SERVICES ERROR:", error);

      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);


/* =========================
   UPDATE SERVICE
========================= */
router.patch(
  "/:id",
  protect,
  authorize("provider"),
  providerVerified,
  updateService
);


/* =========================
   CATEGORY ROUTES
========================= */
router.get("/categories", getCategories);

router.get("/category/:slug", getServicesByCategory);


/* =========================
   PUBLIC SERVICES
========================= */

// 🔥 IMPORTANT: keep "/" BEFORE "/:id"
router.get("/", getAllServices);

router.get("/:id", getServiceById);


module.exports = router;

