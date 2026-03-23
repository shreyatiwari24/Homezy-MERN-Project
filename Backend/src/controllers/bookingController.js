const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { v4: uuidv4 } = require("uuid");
const Notification = require("../models/notifications");



/* =========================
   CREATE BOOKING
========================= */
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledDate, bookingTime, notes } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.status !== "approved") {
      return res.status(400).json({
        message: "Service not available for booking",
      });
    }

    if (typeof service.price !== "number") {
      return res.status(400).json({
        message: "Service price is missing or invalid",
      });
    }

    const booking = await Booking.create({
      bookingId: uuidv4(),
      service: service._id,
      customer: req.user._id,
      provider: service.provider,
      price: Number(service.price),
      scheduledDate,
      bookingTime,
      notes,
      status: "pending",
    });

    // CREATE NOTIFICATION HERE
    await Notification.create({
      user: service.provider,
      title: "New Booking",
      message: `You received a new booking for ${service.name}`,
      type: "booking"
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   PROVIDER UPDATE STATUS
========================= */

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "accepted" && { acceptedAt: new Date() }),
        ...(status === "rejected" && { rejectedAt: new Date() }),
        ...(status === "completed" && { completedAt: new Date() }),
        ...(status === "cancelled" && { cancelledAt: new Date() }),
      },
      { new: true }
    );

    res.json({
      message: "Status updated",
      booking: updatedBooking,
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CUSTOMER CANCEL BOOKING
========================= */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Cannot cancel this booking",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CUSTOMER BOOKINGS
========================= */
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("service")
      .populate("provider", "name email");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   PROVIDER BOOKINGS
========================= */
exports.getProviderBookings = async (req, res) => {
  try {
    const filter = { provider: req.user._id };

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate("service", "name price")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




