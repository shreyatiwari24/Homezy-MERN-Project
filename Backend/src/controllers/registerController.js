const Review   = require("../models/Review");
const Booking  = require("../models/Booking");
const User     = require("../models/User");

/* ─────────────────────────────────────────
   HELPER — recalculate provider rating
   Uses DB aggregation instead of in-memory
   math so it stays accurate even if reviews
   are deleted in the future.
───────────────────────────────────────── */
const syncProviderRating = async (providerId) => {
  const [agg] = await Review.aggregate([
    { $match: { provider: providerId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews:  { $sum: 1 },
      },
    },
  ]);

  await User.findByIdAndUpdate(providerId, {
    averageRating: agg ? parseFloat(agg.averageRating.toFixed(2)) : 0,
    totalReviews:  agg ? agg.totalReviews : 0,
  });
};

/* ═════════════════════════════════════════
   CREATE REVIEW  (customer)
   POST /reviews
═════════════════════════════════════════ */
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // booking must exist
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // only the booking owner may review
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only review your own bookings",
      });
    }

    // booking must be completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Only completed bookings can be reviewed",
      });
    }

    // prevent duplicate — use booking field consistently
    const duplicate = await Review.findOne({ booking: bookingId });
    if (duplicate) {
      return res.status(400).json({ message: "Review already submitted" });
    }

    // create review
    const review = await Review.create({
      booking:  bookingId,
      service:  booking.service,
      provider: booking.provider,
      customer: booking.customer,
      rating,
      comment:  comment?.trim() || "",
    });

    // keep provider stats in sync via aggregation (safe & accurate)
    await syncProviderRating(booking.provider);

    const populated = await review.populate([
      { path: "service",  select: "name" },
      { path: "provider", select: "name" },
      { path: "booking",  select: "scheduledDate bookingTime" },
    ]);

    return res.status(201).json({
      message: "Review submitted successfully",
      review:  populated,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ═════════════════════════════════════════
   GET MY REVIEWS  (customer — own reviews)
   GET /reviews/my-reviews
   Required by CustomerReviews.jsx
═════════════════════════════════════════ */
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user._id })
      .populate({
        path:     "booking",
        select:   "scheduledDate bookingTime",
        populate: [
          { path: "service",  select: "name" },
          { path: "provider", select: "name" },
        ],
      })
      .populate("service",  "name")
      .populate("provider", "name")
      .sort({ createdAt: -1 });

    // reshape so frontend receives bookingId as the populated booking object
    const shaped = reviews.map((r) => ({
      _id:       r._id,
      rating:    r.rating,
      comment:   r.comment,
      createdAt: r.createdAt,
      bookingId: r.booking,          // aliased for CustomerReviews.jsx
      service:   r.service,
      provider:  r.provider,
    }));

    return res.json(shaped);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ═════════════════════════════════════════
   GET REVIEWS FOR A SERVICE
   GET /reviews/service/:serviceId
═════════════════════════════════════════ */
exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    return res.json(reviews);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ═════════════════════════════════════════
   GET REVIEWS FOR A PROVIDER
   GET /reviews/provider/:providerId
═════════════════════════════════════════ */
exports.getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    return res.json(reviews);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};