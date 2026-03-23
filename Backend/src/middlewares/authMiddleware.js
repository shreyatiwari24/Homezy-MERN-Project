const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ================= PROTECT ROUTE ================= */
exports.protect = async (req, res, next) => {
  try {
    let token;

    //  Extract token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //  No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  FIX: support all possible token structures
    const userId = decoded.id || decoded._id || decoded.sub;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    //  Fetch user (exclude password)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    //  Optional: email verification check
    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    // Attach user to request
    req.user = user;

    //  Debug (remove in production)
    console.log("Authenticated user:", user._id.toString());

    next();

  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/* ================= ROLE AUTHORIZE ================= */
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const userRoles = req.user.roles || [];

      const hasAccess = allowedRoles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasAccess) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();

    } catch (error) {
      console.error("Authorization Error:", error.message);

      return res.status(500).json({
        message: "Authorization failed",
      });
    }
  };
};