const User = require("../models/User");
const ProviderProfile = require("../models/ProviderProfile");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/* =====================================================
   TOKEN GENERATOR
===================================================== */
const generateToken = (user) => {
  return jwt.sign(
    { sub: user._id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/* =====================================================
   SEND VERIFICATION EMAIL (SAFE)
===================================================== */
const sendVerificationEmail = async (user) => {
  try {
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expireTime = Date.now() + 24 * 60 * 60 * 1000;

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerificationToken: hashedToken,
          emailVerificationExpire: expireTime,
        },
      }
    );

    const verifyURL = `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/verify-email/${rawToken}`;

    console.log(`\n\n================================`);
    console.log(`🔗 VERIFICATION LINK FOR ${user.email}:`);
    console.log(verifyURL);
    console.log(`================================\n\n`);

    const html = `
      <h2>Email Verification — Homezy</h2>
      <p>Click below to verify your email address:</p>
      <a href="${verifyURL}" style="
        display:inline-block;padding:12px 24px;
        background:linear-gradient(135deg,#FF6B1A,#4080FF);
        color:white;border-radius:8px;text-decoration:none;font-weight:bold;
      ">Verify Email</a>
      <p style="color:#888;font-size:12px;margin-top:16px;">
        This link expires in 24 hours.
      </p>
    `;

    await sendEmail(user.email, "Verify your Homezy email", html);

  } catch (err) {
    console.error("EMAIL ERROR:", err.message);
    // Do NOT throw → prevents registration crash
  }
};

/* =====================================================
   REGISTER USER
===================================================== */
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      category,
      experience,
      rate,
      bio,
      city,
      area,
      pincode,
      address,
      coordinates,
    } = req.body;

    /* ── BASIC VALIDATION ── */
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const requestedRole = role === "provider" ? "provider" : "customer";

    /* ── PROVIDER VALIDATION ── */
    if (requestedRole === "provider") {
      if (!phone || !category || !rate || !city || !area || !pincode) {
        return res.status(400).json({
          message: "Missing required provider information",
        });
      }
    }

    let user = await User.findOne({ email: normalizedEmail });

    /* =====================================================
       EXISTING USER
    ===================================================== */
    if (user) {
      if (user.roles.includes("admin")) {
        return res.status(403).json({
          message: "Admin accounts cannot be modified",
        });
      }

      if (user.roles.includes(requestedRole)) {
        if (!user.emailVerified) {
          await sendVerificationEmail(user);
          return res.json({
            success: true,
            message: "Verification email resent",
          });
        }

        return res.status(409).json({
          message: `Already registered as ${requestedRole}`,
        });
      }

      user.roles.push(requestedRole);

      if (requestedRole === "provider") {
        user.phone = phone;
        user.category = category;
        user.experience = Number(experience) || 0;
        user.rate = rate ? Number(rate) : 0;
        user.bio = bio || "";
        user.city = city;
        user.area = area;
        user.pincode = String(pincode);
        user.address = address || "";

        if (
          coordinates &&
          Array.isArray(coordinates) &&
          coordinates.length === 2
        ) {
          user.location = { type: "Point", coordinates };
        }
      }

      await user.save();
    }

    /* =====================================================
       NEW USER
    ===================================================== */
    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        roles: [requestedRole],

        ...(requestedRole === "provider" && {
          phone,
          category,
          experience: Number(experience) || 0,
          rate: rate ? Number(rate) : 0,
          bio: bio || "",
          city,
          area,
          pincode: String(pincode),
          address: address || "",

          ...(coordinates &&
            Array.isArray(coordinates) &&
            coordinates.length === 2 && {
              location: { type: "Point", coordinates },
            }),
        }),

        isApproved: false,
        isRejected: false,
      });
    }

    /* ── EMAIL (SAFE) ── */
    await sendVerificationEmail(user);

    return res.status(201).json({
      success: true,
      message:
        requestedRole === "provider"
          ? "Application received! Verify email. Await admin approval."
          : "Verification email sent.",
    });

  } catch (error) {
    console.error("REGISTER ERROR FULL:", error);

    return res.status(500).json({
      message: error.message || "Server error during registration",
    });
  }
};

/* =====================================================
   LOGIN USER
===================================================== */
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password"); //  REQUIRED

    if (!user) {
      console.log(`Login failed: User not found for email ${normalizedEmail}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("Entered password:", password);
console.log("Stored hash:", user.password);

    const isMatch = await user.comparePassword(password);
    console.log(`Login attempt for ${normalizedEmail}: password match = ${isMatch}`);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ── ROLE CHECK ── */
    if (role && !user.roles.includes(role)) {
      return res.status(403).json({
        message: `Not registered as ${role}`,
      });
    }

    /* ── EMAIL CHECK ── */
    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    /* ── PROVIDER CHECK ── */
    if (role === "provider") {
      if (user.isRejected) {
        return res.status(403).json({
          message: "Application rejected",
        });
      }

      if (!user.isApproved) {
        return res.status(403).json({
          message: "Application under review",
        });
      }

      const profile = await ProviderProfile.findOne({
        user: user._id,
      });

      if (!profile) {
        console.warn(" Approved provider missing profile");
      }
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isApproved: user.isApproved,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error during login",
    });
  }
};

/* =====================================================
   VERIFY EMAIL
===================================================== */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired link");
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    const isProvider = user.roles.includes("provider");

    return res.redirect(
      isProvider
        ? `${process.env.CLIENT_URL || "http://localhost:5173"}/email-verified?role=provider`
        : `${process.env.CLIENT_URL || "http://localhost:5173"}/email-verified`
    );

  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return res.status(500).send("Verification failed");
  }
};

/* =====================================================
   GOOGLE LOGIN
===================================================== */
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID");

exports.googleLogin = async (req, res) => {
  try {
    const { credential, role } = req.body;
    const requestedRole = role === "provider" ? "provider" : "customer";

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (user) {
      if (!user.roles.includes(requestedRole)) {
        user.roles.push(requestedRole);
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: crypto.randomBytes(16).toString("hex"), // Dummy password
        roles: [requestedRole],
        emailVerified: true,
        profileImage: picture,
        isApproved: requestedRole === "customer" ? true : false,
      });
    }

    if (requestedRole === "provider" && !user.isApproved && !user.isRejected) {
       return res.status(403).json({
          message: "Application under review",
       });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        isApproved: user.isApproved,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.status(500).json({
      message: error.message || "Server error during Google login",
    });
  }
};