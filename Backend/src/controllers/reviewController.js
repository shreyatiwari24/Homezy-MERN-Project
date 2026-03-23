const Review = require("../models/Review");
const Booking = require("../models/Booking");
const User = require("../models/User");

/* =====================================
   CREATE REVIEW (CUSTOMER)
===================================== */
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    /* ── Validation ── */
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({
        message: "Comment must be at least 3 characters",
      });
    }

    /* ── Booking check ── */
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    /* ── Ownership check ── */
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to review this booking",
      });
    }

    /* ── Status check ── */
    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Complete booking before reviewing",
      });
    }

    /* ── Prevent duplicate ── */
    const existing = await Review.findOne({ booking: bookingId });
    if (existing) {
      return res.status(400).json({
        message: "Review already submitted",
      });
    }

    /* ── Create review ── */
    const review = await Review.create({
      booking: bookingId,
      service: booking.service,
      provider: booking.provider,
      customer: booking.customer,
      rating,
      comment,
    });

    /* ── Recalculate provider rating (SAFE) ── */
    const stats = await Review.aggregate([
      { $match: { provider: booking.provider } },
      {
        $group: {
          _id: "$provider",
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]);

    const avgRating = stats[0]?.avgRating || rating;
    const totalReviews = stats[0]?.total || 1;

    await User.findByIdAndUpdate(booking.provider, {
      averageRating: avgRating,
      totalReviews: totalReviews,
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =====================================
   GET MY REVIEWS (CUSTOMER)
===================================== */
exports.getMyReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const reviews = await Review.find({
      customer: req.user._id,
    })
      .populate({
        path: "booking",
        populate: [
          { path: "service", select: "name" },
          { path: "provider", select: "name" },
        ],
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({
      customer: req.user._id,
    });

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =====================================
   GET REVIEWS FOR A SERVICE
===================================== */
exports.getServiceReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const reviews = await Review.find({
      service: req.params.serviceId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({
      service: req.params.serviceId,
    });

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =====================================
   GET REVIEWS FOR PROVIDER
===================================== */
exports.getProviderReviews = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const reviews = await Review.find({
      provider: req.params.providerId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments({
      provider: req.params.providerId,
    });

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

