const express = require("express");
const cors = require("cors");

const app = express();

/* CORS FIRST */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


/* Body parser */
app.use(express.json());

/* Routes */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/provider", require("./routes/providerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/saved-providers", require("./routes/savedProviderRoutes"));

app.use("/api/notifications",require("./routes/notificationsRoutes"));



/* Global error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

module.exports = app;
