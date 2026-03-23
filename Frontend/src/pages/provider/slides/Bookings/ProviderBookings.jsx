import { useEffect, useState } from "react";
import API from "../../../../api/axios";
import BookingTabs from "./BookingTabs";
import BookingStats from "./BookingStats";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  accepted:  "bg-green-400/10 text-green-400 border border-green-400/20",
  rejected:  "bg-red-400/10 text-red-400 border border-red-400/20",
  completed: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
  cancelled: "bg-[#1F2D50] text-[#7A8FBA] border border-[#1F2D50]",
  pending:   "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
};

const EMPTY_MESSAGES = {
  pending:   "No pending bookings",
  accepted:  "No accepted bookings",
  completed: "No completed bookings",
  rejected:  "No rejected bookings",
  all:       "No bookings found",
};

const ProviderBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [filter, setFilter]           = useState("all");
  const [loadingId, setLoadingId]     = useState(null);
  const [fetching, setFetching]       = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setFetching(true);
      // ✅ Fixed: correct route + read .bookings from response
      const res = await API.get("/bookings/provider-bookings");
      setAllBookings(res.data.bookings || res.data || []);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    } finally {
      setFetching(false);
    }
  };

  const filteredBookings = filter === "all"
    ? allBookings
    : allBookings.filter(b => b.status === filter);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this booking?`)) return;

    try {
      setLoadingId(id);
      const res = await API.patch(`/bookings/${id}/status`, { status });
      // ✅ Instant UI update
      setAllBookings(prev =>
        prev.map(b => b._id === id ? { ...b, ...res.data.booking } : b)
      );
      toast.success(`Booking ${status} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  if (fetching) return (
    <div
      className="p-8 space-y-4"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6 animate-pulse space-y-3">
          <div className="h-4 bg-[#1F2D50] rounded-full w-1/3" />
          <div className="h-3 bg-[#1F2D50] rounded-full w-1/2" />
          <div className="h-3 bg-[#1F2D50] rounded-full w-2/5" />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="p-6 md:p-8 space-y-6"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-orange-500 to-blue-500" />
        <h2
          className="text-2xl font-black text-[#EDF2FF] tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Booking Requests
        </h2>
      </div>

      {/* Stats */}
      <BookingStats bookings={allBookings} />

      {/* Tabs */}
      <BookingTabs filter={filter} setFilter={setFilter} />

      {/* Empty state */}
      {filteredBookings.length === 0 ? (
        <div className="bg-gradient-to-br from-[#121830] to-[#0D1224] border border-dashed border-[#1F2D50] rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-[#7A8FBA] font-semibold">
            {EMPTY_MESSAGES[filter] || "No bookings found"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6 space-y-4 hover:border-orange-500/30 transition-colors duration-200"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-orange-500 to-blue-500 opacity-40" />

              {/* Header row */}
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <h3
                  className="text-lg font-black text-[#EDF2FF]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {booking.service?.name || "Service"}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[booking.status] || STATUS_STYLES.pending}`}>
                  {booking.status}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[#3D4E70] font-bold uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-[#EDF2FF] font-semibold">{booking.customer?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#3D4E70] font-bold uppercase tracking-wider mb-1">Date</p>
                  <p className="text-[#EDF2FF] font-semibold">
                    {new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                </div>
                {booking.bookingTime && (
                  <div>
                    <p className="text-xs text-[#3D4E70] font-bold uppercase tracking-wider mb-1">Time</p>
                    <p className="text-[#EDF2FF] font-semibold">{booking.bookingTime}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#3D4E70] font-bold uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-orange-400 font-black">₹{booking.price}</p>
                </div>
                <div>
                  <p className="text-xs text-[#3D4E70] font-bold uppercase tracking-wider mb-1">Booking ID</p>
                  <p className="text-[#7A8FBA] text-xs font-mono">{booking.bookingId?.slice(0, 8)}…</p>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="bg-[#0D1224] border border-[#1F2D50] rounded-xl px-4 py-3">
                  <p className="text-xs text-[#3D4E70] font-bold uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-[#7A8FBA]">{booking.notes}</p>
                </div>
              )}

              {/* Actions — Pending */}
              {booking.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => updateStatus(booking._id, "accepted")}
                    disabled={loadingId === booking._id}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-green-400 bg-green-400/10 border border-green-400/30 hover:bg-green-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {loadingId === booking._id ? "Processing…" : "✓ Accept"}
                  </button>
                  <button
                    onClick={() => updateStatus(booking._id, "rejected")}
                    disabled={loadingId === booking._id}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-transparent border border-red-400/30 hover:bg-red-400/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {loadingId === booking._id ? "Processing…" : "✕ Reject"}
                  </button>
                </div>
              )}

              {/* Actions — Accepted */}
              {booking.status === "accepted" && (
                <button
                  onClick={() => updateStatus(booking._id, "completed")}
                  disabled={loadingId === booking._id}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                >
                  {loadingId === booking._id ? "Processing…" : "✓ Mark as Completed"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;