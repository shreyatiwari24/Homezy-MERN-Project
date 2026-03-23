const ProviderProfile = require("../models/ProviderProfile");

module.exports = async (req, res, next) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — please login"
      });
    }

    const roles = req.user.roles || [];

    if (!roles.includes("provider")) {
      return res.status(403).json({
        success: false,
        message: "Access denied — providers only"
      });
    }

    const profile = await ProviderProfile.findOne({
      user: req.user._id
    });

    //  Clear message — tells you exactly what's wrong
    if (!profile) {
      return res.status(403).json({
        success: false,
        message: "Your account is pending admin approval. You cannot create services yet."
      });
    }

    if (profile.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is still under review. Please wait for admin approval."
      });
    }

    if (profile.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account has been rejected. Please contact support."
      });
    }

    if (profile.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Account not approved"
      });
    }

    //  attach profile to request for use in controllers
    req.providerProfile = profile;

    next();

  } catch (error) {
    console.error("Provider verification error:", error);
    res.status(500).json({
      success: false,
      message: "Provider verification failed"
    });
  }
};
