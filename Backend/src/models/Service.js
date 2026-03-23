const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    images: [{ type: String }],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    /* ================= LOCATION ================= */

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      // FIX: not required — provider may not have GPS
      // empty array causes validator crash and service never saves
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },

      city: {
        type: String,
        trim: true,
        required: true,
      },

      area: {
        type: String,
        trim: true,
      },

      address: {
        type: String,
        trim: true,
      },

      pincode: {
        type: String,
        trim: true,
        required: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

//  2dsphere for geo-radius search
serviceSchema.index({ "location": "2dsphere" });

//  pincode for fallback filter
serviceSchema.index({ "location.pincode": 1 });

// category + status for listing queries
serviceSchema.index({ category: 1, status: 1, isActive: 1 });

//  provider for my-services queries
serviceSchema.index({ provider: 1, status: 1 });

module.exports = mongoose.model("Service", serviceSchema);