const Service = require("../models/Service");
const Category = require("../models/ServiceCategory");
const ProviderProfile = require("../models/ProviderProfile");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

/* ================= CREATE SERVICE ================= */
exports.createService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      name, description, price, category, subcategory,
      city, area, address, pincode, lat, lng
    } = req.body;

    /* ── Category validation ── */
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID — please select a valid category",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    /* ── Provider profile ── */
    const providerProfile = await ProviderProfile.findOne({ user: req.user._id });
    if (!providerProfile) {
      return res.status(404).json({ success: false, message: "Provider profile not found" });
    }

    /* ── Build coordinates safely ── */
    const finalLat = lat || providerProfile.location?.coordinates?.[1] || null;
    const finalLng = lng || providerProfile.location?.coordinates?.[0] || null;

    const finalCoordinates = (finalLat && finalLng)
      ? [Number(finalLng), Number(finalLat)]
      : [0, 0];

    /* ── Build location object ── */
    const finalLocation = {
      type: "Point",
      coordinates: finalCoordinates,
      city: city || providerProfile.city || "",
      area: area || providerProfile.area || "",
      address: address || providerProfile.address || "",
      pincode: String(pincode || providerProfile.pincode || "").trim(),
    };

    /* ── Validate required location fields ── */
    if (!finalLocation.city || !finalLocation.pincode) {
      return res.status(400).json({
        success: false,
        message: "City and pincode are required for the service location",
      });
    }

    const service = await Service.create({
      name,
      description,
      price: Number(price),
      category,
      subcategory,
      provider: req.user._id,
      status: "pending",
      isActive: true,
      location: finalLocation,
    });

    res.status(201).json({
      success: true,
      message: "Service submitted for approval",
      service,
    });

  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create service" });
  }
};

/* ================= GET PROVIDER'S OWN SERVICES ================= */
// GET /services/my-services?status=all|approved|pending|rejected
// Protected — provider only


exports.getProviderServices = async (req, res) => {
  try {
    const { status } = req.query;

    // ALWAYS convert to ObjectId
    const providerId = new mongoose.Types.ObjectId(req.user._id);

    // base filter
    const filter = { provider: providerId };

    //  safe status filter (case-insensitive)
    if (status && status !== "all") {
      filter.status = {
        $regex: `^${status}$`,
        $options: "i",
      };
    }

    //  DEBUG (remove later)
    console.log("REQ USER:", req.user._id);
    console.log("FILTER:", filter);

    const services = await Service.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    console.log("FOUND SERVICES:", services.length);

    return res.json(services);

  } catch (error) {
    console.error("Get Provider Services Error:", error);
    return res.status(500).json({
      message: "Failed to fetch your services",
    });
  }
};

/* ================= GET ALL SERVICES (public) ================= */
exports.getAllServices = async (req, res) => {
  try {
    const { category, subcategory, pincode, search, lat, lng } = req.query;

    const filter = { status: "approved", isActive: true };

    /* ── Category filter ── */
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category;
      } else {
        const categoryDoc = await Category.findOne({
          slug: category.toLowerCase(),
        });
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        } else {
          return res.json({ success: true, services: [] });
        }
      }
    }

    /* ── Subcategory filter ── */
    if (subcategory) filter.subcategory = subcategory;

    /* ── Search filter ── */
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let services;

    /* ── Geo filter (priority) ── */
    if (lat && lng) {
      const geoFilter = {
        ...filter,
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
            $maxDistance: 10000,
          },
        },
      };

      try {
        services = await Service.find(geoFilter)
          .populate("category", "name slug")
          .populate("provider", "name email")
          .sort({ createdAt: -1 });
      } catch (geoErr) {
        console.warn("Geo query failed, falling back to pincode:", geoErr.message);
        services = null;
      }
    }

    /* ── Pincode fallback ── */
    if (!services) {
      if (pincode) {
        filter["location.pincode"] = {
          $regex: `^${String(pincode).trim()}`,
          $options: "i",
        };
      }

      services = await Service.find(filter)
        .populate("category", "name slug")
        .populate("provider", "name email")
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, services });

  } catch (error) {
    console.error("Get Services Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
};

/* ================= GET SERVICES BY CATEGORY ================= */
exports.getServicesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug.toLowerCase(),
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const services = await Service.find({
      category: category._id,
      status: "approved",
      isActive: true,
    })
      .populate("provider", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, services });

  } catch (error) {
    console.error("Category Services Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
};

/* ================= GET SERVICE BY ID ================= */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category", "name slug")
      .populate("provider", "name email");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service });

  } catch (error) {
    console.error("Service detail error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch service" });
  }
};

/* ================= UPDATE SERVICE ================= */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      provider: req.user._id,
    });

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    service.name = req.body.name || service.name;
    service.description = req.body.description || service.description;
    service.price = req.body.price || service.price;

    if (req.body.pincode) service.location.pincode = String(req.body.pincode).trim();
    if (req.body.address) service.location.address = req.body.address;
    if (req.body.city) service.location.city = req.body.city;
    if (req.body.area) service.location.area = req.body.area;

    service.status = "pending";

    await service.save();

    res.json({
      success: true,
      message: "Service updated and sent for re-approval",
      service,
    });

  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({ success: false, message: "Failed to update service" });
  }
};

/* ================= GET CATEGORIES ================= */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select("_id name slug icon")
      .sort({ name: 1 });

    res.json(categories);

  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};