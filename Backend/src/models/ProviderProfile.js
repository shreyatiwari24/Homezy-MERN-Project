const mongoose = require("mongoose");

/* ================================
   GEO LOCATION
================================ */

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number],
    required: false,      //  FIX: not required — provider may skip GPS
    default: [0, 0]       //  safe fallback
  }
});

const providerProfileSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  businessName: {
    type: String,
    trim: true,
    maxlength: 100
  },

  phone: {
    type: String,
    required: true,
    //  FIX: strip formatting before saving, validate loosely
    match: /^[\d\s\+\-\(\)]{7,20}$/
  },

  category: {
    type: String,
    required: true,
    trim: true,
    //  FIX: lowercase enum + transform on save (see middleware below)
    enum: [
      "Plumbing",
      "Electrician",
      "Cleaning",
      "Carpentry",
      "Painting",
      "AC Repair",
      "Appliance Repair",
      "Other"
    ]
  },

  /* ================================
     ADDRESS
  ================================ */

  city: {
    type: String,
    required: true,
    trim: true
  },

  area: {
    type: String,
    required: true,
    trim: true
  },

  pincode: {
    type: String,
    required: true,
    trim: true
  },

  address: {
    type: String,
    maxlength: 300
  },

  /* ================================
     GEO LOCATION
  ================================ */

  location: {
    type: locationSchema,
    //  FIX: whole location block is optional
    required: false
  },

  /* ================================
     BUSINESS DETAILS
  ================================ */

  experience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0     //  safe default
  },

  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 100000
  },

  bio: {
    type: String,
    maxlength: 1000
  },

  serviceAreas: [
    {
      type: String,
      trim: true
    }
  ],

  /* ================================
     SOCIAL LINKS
  ================================ */

  socialLinks: {
    facebook:  { type: String, match: /^https?:\/\/.+$/ },
    instagram: { type: String, match: /^https?:\/\/.+$/ },
    website:   { type: String, match: /^https?:\/\/.+$/ }
  },

  /* ================================
     REVIEWS
  ================================ */

  rating:        { type: Number, default: 0, min: 0, max: 5 },
  totalReviews:  { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },

  /* ================================
     STATUS
  ================================ */

  availability: {
    type: Boolean,
    default: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  rejectionReason: {
    type: String,
    maxlength: 500
  }

}, { timestamps: true });

/* ================================
   INDEXES
================================ */

providerProfileSchema.index({ location: "2dsphere" });
providerProfileSchema.index({ pincode: 1 });
providerProfileSchema.index({ category: 1 });
providerProfileSchema.index({ status: 1 });
providerProfileSchema.index({ city: 1, area: 1 }); // ✅ for location filtering

/* ================================
   PRE-SAVE: normalize category + phone
================================ */

providerProfileSchema.pre("save", async function () {

  // normalize category
  if (this.isModified("category") && this.category) {
    this.category = this.category
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // clean phone
  if (this.isModified("phone") && this.phone) {
    this.phone = this.phone.replace(/[\s\-\(\)]/g, "");
  }

});

module.exports = mongoose.model("ProviderProfile", providerProfileSchema);