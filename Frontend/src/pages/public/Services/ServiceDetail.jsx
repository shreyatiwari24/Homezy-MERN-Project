import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/axios";
import { Calendar, Clock, FileText, MapPin, Tag, User, Shield } from "lucide-react";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  const [bookingDate, setBookingDate]   = useState("");
  const [bookingTime, setBookingTime]   = useState("");
  const [notes, setNotes]               = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError]     = useState("");

  // ✅ Ref-based lock — prevents double booking even on fast double clicks
  const submittingRef = useRef(false);
  // ✅ Track if already booked this session
  const alreadyBookedRef = useRef(false);

  /* ── Fetch service ── */
  useEffect(() => {
    if (!id) return;
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/services/${id}`);
      const data = res.data?.service || res.data;
      if (!data) { setError("Service not found"); return; }
      setService(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  /* ── Today's date string for min date ── */
  const todayStr = new Date().toISOString().split("T")[0];

  /* ── Validate booking inputs ── */
  const validateBooking = () => {
    if (!bookingDate)  return "Please select a date";
    if (!bookingTime)  return "Please select a time";

    // prevent past bookings
    const selectedDateTime = new Date(`${bookingDate}T${bookingTime}`);
    const now = new Date();
    if (selectedDateTime <= now) return "Please select a future date and time";

    // minimum 1 hour notice
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (selectedDateTime < oneHourFromNow) return "Please book at least 1 hour in advance";

    return null;
  };

  /* ── Handle booking ── */
  const handleBooking = useCallback(async () => {

    // ✅ Block 1 — ref lock prevents simultaneous/double clicks
    if (submittingRef.current) return;

    // ✅ Block 2 — already booked this session
    if (alreadyBookedRef.current) {
      setBookingError("You have already booked this service.");
      return;
    }

    // ✅ Block 3 — check login
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/Customer/login");
      return;
    }

    // ✅ Block 4 — validate inputs
    const validationError = validateBooking();
    if (validationError) {
      setBookingError(validationError);
      return;
    }

    // ✅ Lock submission
    submittingRef.current = true;
    setBookingLoading(true);
    setBookingError("");

    try {
      await API.post("/bookings", {
        serviceId:     service._id,
        scheduledDate: bookingDate,
        bookingTime,
        notes: notes.trim(),
      });

      // ✅ Mark as booked — prevents re-booking
      alreadyBookedRef.current = true;
      setBookingSuccess(true);
      setBookingDate("");
      setBookingTime("");
      setNotes("");

    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed. Please try again.";
      setBookingError(msg);
      // ✅ Only release lock on failure — success stays locked
      submittingRef.current = false;
    } finally {
      setBookingLoading(false);
    }
  }, [bookingDate, bookingTime, notes, service, navigate]);

  /* ── Format location object ── */
  const formatLocation = (loc) => {
    if (!loc) return "Not specified";
    if (typeof loc === "string") return loc;
    const parts = [loc.area, loc.city, loc.pincode].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  /* ── States ── */
  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-[#080C18]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-[#7A8FBA] text-sm">Loading service…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#080C18] gap-4 px-6">
      <div className="text-5xl">😕</div>
      <h2 className="text-xl font-black text-[#EDF2FF]" style={{ fontFamily: "'Syne', sans-serif" }}>
        {error}
      </h2>
      <button
        onClick={() => navigate("/services")}
        className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold text-sm"
      >
        Browse Services
      </button>
    </div>
  );

  if (!service) return null;

  return (
    <section
      className="min-h-screen pt-28 pb-20 px-6 bg-gradient-to-b from-[#080C18] via-[#0D1224] to-[#080C18]"
      
    >
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#7A8FBA] hover:text-[#EDF2FF] transition-colors mb-8"
        >
          ← Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ══ LEFT ══ */}
          <div className="lg:col-span-2 space-y-5">

            {/* Image */}
            <div className="rounded-2xl overflow-hidden border border-[#1F2D50]">
              {service.images?.length > 0 ? (
                <img
                  src={service.images[0]}
                  alt={service.name}
                  className="w-full h-[340px] object-cover"
                />
              ) : (
                <div className="h-[240px] flex flex-col items-center justify-center bg-gradient-to-br from-[#121830] to-[#0D1224] text-[#3D4E70] gap-3">
                  <div className="text-5xl">🛠</div>
                  <p className="text-sm">No image available</p>
                </div>
              )}
            </div>

            {/* Title + Price */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6">
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-orange-500 via-blue-500 to-transparent" />
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[#EDF2FF] mb-2" >
                    {service.name}
                  </h1>
                  {service.category && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      {service.category?.name || service.category}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-orange-400">₹{service.price}</p>
                  <p className="text-xs text-[#7A8FBA] mt-1">per service</p>
                </div>
              </div>
            </div>

            {/* Provider */}
            <div className="bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg shadow-orange-500/20">
                {service.provider?.name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <div>
                <p className="font-bold text-[#EDF2FF]">{service.provider?.name || "Provider"}</p>
                <p className="text-sm text-[#7A8FBA] flex items-center gap-1 mt-0.5">
                  <User className="w-3 h-3" /> Verified Service Provider
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6">
              <h2 className="text-lg font-black text-[#EDF2FF] mb-3" >
                About this Service
              </h2>
              <p className="text-[#7A8FBA] leading-relaxed text-sm">
                {service.description || "No description provided."}
              </p>
            </div>

            {/* Details */}
            <div className="bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6 grid grid-cols-2 gap-5">
              {[
                { label: "Category", value: service.category?.name || service.category || "—", icon: <Tag className="w-4 h-4" /> },
                { label: "Location", value: formatLocation(service.location), icon: <MapPin className="w-4 h-4" /> },
                { label: "Duration", value: service.duration || "Flexible", icon: <Clock className="w-4 h-4" /> },
                { label: "Provider", value: service.provider?.name || "—", icon: <User className="w-4 h-4" /> },
              ].map(({ label, value, icon }) => (
                <div key={label}>
                  <p className="text-xs text-[#3D4E70] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <span className="text-orange-500">{icon}</span>{label}
                  </p>
                  <p className="text-sm font-semibold text-[#EDF2FF]">{value}</p>
                </div>
              ))}
            </div>

          </div>

          {/* ══ RIGHT — Booking Panel ══ */}
          <div className="sticky top-28 h-fit">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6 space-y-5 shadow-2xl shadow-black/40">
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-blue-500 via-orange-500 to-transparent" />

              <div>
                <h2 className="text-xl font-black text-[#EDF2FF]" >
                  Book this Service
                </h2>
                <p className="text-xs text-[#3D4E70] mt-1">Select your preferred slot</p>
              </div>

              {/* ✅ Success state — locks panel */}
              {bookingSuccess ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-green-500/30">
                    ✓
                  </div>
                  <div>
                    <p className="font-black text-[#EDF2FF] text-lg" >
                      Booking Confirmed!
                    </p>
                    <p className="text-sm text-[#7A8FBA] mt-1">
                      Check your bookings for details.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/customer/bookings")}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-blue-500 text-white font-bold text-sm"
                  >
                    View My Bookings
                  </button>
                </div>
              ) : (
                <>
                  {/* Error */}
                  {bookingError && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold px-4 py-3 rounded-xl">
                      <span className="mt-0.5 flex-shrink-0">⚠</span>
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" /> Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={todayStr}
                      onChange={e => { setBookingDate(e.target.value); setBookingError(""); }}
                      className="w-full bg-[#0D1224] border border-[#1F2D50] text-[#EDF2FF] px-4 py-3 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>

                  {/* Time */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" /> Time
                    </label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={e => { setBookingTime(e.target.value); setBookingError(""); }}
                      className="w-full bg-[#0D1224] border border-[#1F2D50] text-[#EDF2FF] px-4 py-3 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>

                  {/* Notes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#7A8FBA] flex items-center gap-1.5 uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5" /> Notes
                      <span className="text-[#3D4E70] normal-case tracking-normal font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Any special instructions…"
                      className="w-full bg-[#0D1224] border border-[#1F2D50] text-[#EDF2FF] placeholder-[#3D4E70] px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    />
                  </div>

                  {/* Price summary */}
                  <div className="flex justify-between items-center py-3 border-t border-[#1F2D50]">
                    <span className="text-sm text-[#7A8FBA]">Total</span>
                    <span className="text-xl font-black text-orange-400">₹{service.price}</span>
                  </div>

                  {/* ✅ Book button — disabled during loading */}
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="w-full py-3.5 rounded-xl font-extrabold text-white bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {bookingLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing…
                      </span>
                    ) : "Confirm Booking →"}
                  </button>

                  {/* Trust badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-[#3D4E70]">
                    <Shield className="w-3.5 h-3.5 text-green-500" />
                    Secure booking — no payment till service is done
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceDetail;