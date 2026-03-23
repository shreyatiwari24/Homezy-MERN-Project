const express = require("express");
const router = express.Router();
const Category = require("../models/ServiceCategory");

router.get("/", async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
});

module.exports = router;