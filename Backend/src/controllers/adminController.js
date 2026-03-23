const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const Service = require("../models/Service");

/* ================= HELPER ================= */
const normalizeCategory = (cat) => {
  if (!cat) return "Other";
  return cat
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

/* ================= DASHBOARD STATS ================= */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalCustomers = await User.countDocuments({ roles: "customer" });

    const totalProviders = await User.countDocuments({ roles: "provider" });

    //  query User — pending = email verified but not yet approved
    const pendingProviders = await User.countDocuments({
      roles: "provider",
      emailVerified: true,
      isApproved: false,
      isRejected: { $ne: true },
    });

    const approvedProviders = await User.countDocuments({
      roles: "provider",
      isApproved: true,
    });

    const totalServices   = await Service.countDocuments();
    const pendingServices = await Service.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalCustomers,
      totalProviders,
      pendingProviders,
      approvedProviders,
      totalServices,
      pendingServices,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET PENDING PROVIDERS ================= */
exports.getPendingProviders = async (req, res) => {
  try {
    //  query User — ProviderProfile doesn't exist yet before approval
    const providers = await User.find({
      roles: "provider",
      emailVerified: true,
      isApproved: false,
      isRejected: { $ne: true },
    }).select("-password");

    res.json({
      success: true,
      count: providers.length,
      providers,
    });

  } catch (error) {
    console.error("Pending provider error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= APPROVE PROVIDER ================= */
exports.approveProvider = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Step 1 — approve user
    user.isApproved = true;
    user.isRejected = false;
    await user.save(); // ← crashes here if next() missing in User pre-save

    // Step 2 — create profile
    const existingProfile = await ProviderProfile.findOne({ user: user._id });

    if (!existingProfile) {
      const profile = await ProviderProfile.create({
        user:       user._id,
        phone:      user.phone?.replace(/[\s\-\(\)]/g, "") || "0000000000",
        category:   normalizeCategory(user.category),
        experience: user.experience || 0,
        rate:       user.rate       || 0,
        bio:        user.bio        || "",
        city:       user.city       || "",
        area:       user.area       || "Unknown Area",
        pincode:    user.pincode    || "000000",
        address:    user.address    || "",
        status:     "approved",
        location:   user.location   || { type: "Point", coordinates: [0, 0] },
      });
      console.log(" ProviderProfile created:", profile._id);
    } else {
      existingProfile.status = "approved";
      await existingProfile.save();
      console.log(" Existing profile approved");
    }

    res.json({ success: true, message: "Provider approved and profile created" });

  } catch (error) {
    //  logs the REAL error — not just a warning
    console.error(" APPROVE ERROR:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};
/* ================= REJECT PROVIDER ================= */
exports.rejectProvider = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved      = false;
    user.isRejected      = true;
    user.rejectionReason = req.body.reason || "Did not meet platform requirements";
    await user.save();

    // also update ProviderProfile if it exists
    await ProviderProfile.findOneAndUpdate(
      { user: user._id },
      { status: "rejected", rejectionReason: user.rejectionReason }
    );

    res.json({ success: true, message: "Provider rejected" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET PENDING SERVICES ================= */
exports.getPendingServices = async (req, res) => {
  try {
    const services = await Service.find({ status: "pending" })
      .populate("provider", "name email");

    res.json({ success: true, services });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= APPROVE SERVICE ================= */
exports.approveService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.status = "approved";
    await service.save();

    res.json({ success: true, message: "Service approved" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= REJECT SERVICE ================= */
exports.rejectService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.status          = "rejected";
    service.rejectionReason = req.body.reason || "Not meeting platform guidelines";
    await service.save();

    res.json({ success: true, message: "Service rejected" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};