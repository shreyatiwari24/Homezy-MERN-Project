const express = require("express");
const router = express.Router();

const {
  saveProvider,
  removeSavedProvider,
  getSavedProviders
} = require("../controllers/savedProviderController");

const { protect } = require("../middlewares/authMiddleware");


// Save provider
router.post("/save/:providerId", protect, saveProvider);

// Remove provider
router.delete("/remove/:providerId", protect, removeSavedProvider);

// Get saved providers
router.get("/", protect, getSavedProviders);


module.exports = router;