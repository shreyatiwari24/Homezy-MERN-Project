const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");

/*================================
   CREATE PROVIDER PROFILE
================================ */
exports.createProviderProfile = async (req, res) => {
  try {

    const {
      phone,
      category,
      rate,
      city,
      area,
      pincode,
      address,
      experience,
      bio,
      coordinates
    } = req.body;

    /* ================= VALIDATION ================= */

    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Location coordinates required"
      });
    }

    if (!pincode || String(pincode).trim().length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Valid pincode is required"
      });
    }

    /* ================= SAFE FALLBACKS ================= */

    const safeLocation = {
      city: city || "Unknown City",

      // 🔥 FIX (NO MORE CRASH)
      area: area || "Unknown Area",

      address: address || "",

      pincode: String(pincode).trim(),

      coordinates
    };

    /* ================= CREATE PROFILE ================= */

    const profile = await ProviderProfile.create({

      user: req.user._id,

      phone,
      category,
      rate,
      experience,
      bio,

      city: safeLocation.city,
      area: safeLocation.area,
      address: safeLocation.address,
      pincode: safeLocation.pincode,

      location: {
        type: "Point",
        coordinates: safeLocation.coordinates
      }

    });

    res.status(201).json({
      success: true,
      profile
    });

  } catch (error) {

    console.error("Create Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};
/* ================================
   UPDATE PROVIDER PROFILE
================================ */
exports.getProviderProfile = async (req, res) => {
  try {

    const profile = await ProviderProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error("Profile Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
/* ================================
   DELETE PROVIDER PROFILE
================================ */
exports.deleteProviderProfile = async (req, res) => {
  try {
    const deleted = await ProviderProfile.findOneAndDelete({
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Profile Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   GET PROVIDER DASHBOARD
================================ */
exports.getProviderDashboard = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({
      user: req.user._id,
      
    }).lean();
    console.log("PROFILE FOUND:", profile);
    if (!profile) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    res.json({
      success: true,
      message: "Provider dashboard",
      profile,
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   UPDATE PROVIDER PROFILE
================================ */
exports.updateProviderProfile = async (req, res) => {
  try {

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};



/* ================================
   GET PROVIDER ANALYTICS
================================ */



exports.getProviderAnalytics = async (req, res) => {

  try {

    const providerId = req.user._id;

    const bookings = await Booking.find({
      provider: providerId,
    });

    const totalJobs = bookings.length;

    const completed =
      bookings.filter(
        b => b.status === "completed"
      );

    const totalEarnings =
      completed.reduce(
        (acc, b) =>
          acc +
          (b.amount ||
           b.price ||
           0),
        0
      );

    const completionRate =
      totalJobs === 0
        ? 0
        : Math.round(
            (completed.length /
              totalJobs) *
              100
          );

    res.json({
      totalJobs,
      completionRate,
      totalEarnings,
      rating: 4.8,
      monthly: [],
    });

  } catch (error) {

    console.error(
      "Analytics Error:",
      error
    );

    res.status(500).json({
      message:
        "Analytics failed",
    });

  }

};

/* ================================
   REGISTER (SECURE VERSION)
================================ */
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      category,
      rate,
      city,
    } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Force role to provider (NO privilege escalation)
    const newUser = await User.create({
      name,
      email,
      password,
      role: "provider",
    });

    // Create provider profile
    await ProviderProfile.create({
      user: newUser._id,
      phone,
      category,
      rate,
      city,
    });

    // Generate token securely   not hardcoded
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNearbyProviders = async (req, res) => {

  try {

    const { lat, lng, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude required"
      });
    }

    const query = {
      status: "approved",
      availability: true
    };

    if (category) {
      query.category = category;
    }

    const providers = await ProviderProfile.find({
      ...query,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 10000
        }
      }
    }).populate("user", "name email profileImage");

    res.json({
      success: true,
      providers
    });

  } catch (error) {

    console.error("Nearby Provider Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

