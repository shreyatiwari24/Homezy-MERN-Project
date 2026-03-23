const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* =====================================
   GEO LOCATION
===================================== */

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number], // [lng, lat]
    default: [0, 0]
  }
});

/* =====================================
   USER SCHEMA
===================================== */

const userSchema = new mongoose.Schema({

  /* BASIC INFO */
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    select: false //  important for security
  },

  phone: {
    type: String,
    trim: true
  },

  roles: {
    type: [String],
    enum: ["customer", "provider", "admin"],
    default: ["customer"]
  },

  profileImage: String,

  /* LOCATION */
  city: String,
  area: String,
  pincode: String, 
  address: String,

  location: locationSchema,

  /* PROVIDER INFO */
  category: String,
  experience: Number,
  rate: Number,
  bio: String,

  /* APPROVAL SYSTEM */
  isApproved: {
    type: Boolean,
    default: false
  },

  isRejected: {
    type: Boolean,
    default: false
  },

  rejectionReason: String,

  /* STATUS */
  available: {
    type: Boolean,
    default: true
  },

  /* USER FEATURES */
  savedProviders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  /* EMAIL */
  emailVerified: {
    type: Boolean,
    default: false
  },

  emailVerificationToken: String,
  emailVerificationExpire: Date,

  /* PASSWORD RESET */
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  /* RATINGS */
  averageRating: {
    type: Number,
    default: 0
  },

  totalReviews: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

/* =====================================
   INDEXES (CLEAN - NO DUPLICATES)
===================================== */

userSchema.index({ location: "2dsphere" });
userSchema.index({ pincode: 1 });
userSchema.index({ roles: 1 });

/* =====================================
   PASSWORD HASH
===================================== */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =====================================
   PASSWORD COMPARE
===================================== */

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);