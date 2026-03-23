const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  label: {
    type: String,
    default: "other"
  },

  address: String,
  city: String,
  pincode: String,

  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

}, { timestamps: true });

addressSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Address", addressSchema);