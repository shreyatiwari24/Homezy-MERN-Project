const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    bookingTime: {
      type: String,
    },

    notes: {
      type: String,
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    /* ── Status timestamps ── */
    acceptedAt:  Date,
    rejectedAt:  Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

/* ════════════════════════════════════════
   COMPOUND INDEXES — prevent double booking
   at the DATABASE level (works even if two
   requests hit the server simultaneously)
════════════════════════════════════════ */

//  Provider can't be double-booked at same date + time
bookingSchema.index(
  { provider: 1, scheduledDate: 1, bookingTime: 1 },
  {
    unique: true,
    //  only enforce for active bookings — cancelled/rejected don't block the slot
    partialFilterExpression: {
      status: { $in: ["pending", "accepted"] }
    }
  }
);

//  Customer can't book the same service twice at the same slot
bookingSchema.index(
  { customer: 1, service: 1, scheduledDate: 1, bookingTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "accepted"] }
    }
  }
);

module.exports = mongoose.model("Booking", bookingSchema);