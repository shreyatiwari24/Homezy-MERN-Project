import { useEffect, useState, useMemo } from "react";
import API from "../../../api/axios";
import ReviewModal from "../ReviewModal";

/* ── helpers ── */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_META = {
  pending:   { dot: "bg-yellow-400", badge: "bg-yellow-50 text-yellow-700 border-yellow-200",   label: "Pending"   },
  accepted:  { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Accepted"  },
  completed: { dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700 border-blue-200",          label: "Completed" },
  cancelled: { dot: "bg-red-400",    badge: "bg-red-50 text-red-600 border-red-200",             label: "Cancelled" },
};

const FILTERS = ["all", "pending", "accepted", "completed", "cancelled"];

/* ── small reusables ── */
const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-1">
    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
    <span className={`text-2xl font-bold ${color}`}>{value}</span>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
    <span className="text-sm text-slate-700 font-medium">{value || "—"}</span>
  </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const CustomerBookings = () => {
  const [bookings, setBookings]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [filter, setFilter]                 = useState("all");
  const [search, setSearch]                 = useState("");
  const [sort, setSort]                     = useState("latest");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellingId, setCancellingId]     = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* counts for stat cards */
  const counts = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  /* filter + search + sort */
  const processedBookings = useMemo(() => {
    let data = [...bookings];
    if (filter !== "all") data = data.filter((b) => b.status === filter);
    if (search) data = data.filter((b) =>
      b.service?.name.toLowerCase().includes(search.toLowerCase())
    );
    data.sort((a, b) =>
      sort === "latest"
        ? new Date(b.scheduledDate) - new Date(a.scheduledDate)
        : new Date(a.scheduledDate) - new Date(b.scheduledDate)
    );
    return data;
  }, [bookings, filter, search, sort]);

  const cancelBooking = async (id) => {
    try {
      setCancellingId(id);
      await API.patch(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancellingId(null);
    }
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-600 text-white">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 right-20 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-bold mb-1">My Bookings</h1>
          <p className="text-blue-200 text-sm">Manage, track and review your services seamlessly.</p>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total"     value={counts.total}     color="text-slate-800"   />
        <StatCard label="Pending"   value={counts.pending}   color="text-yellow-500"  />
        <StatCard label="Completed" value={counts.completed} color="text-blue-600"    />
        <StatCard label="Cancelled" value={counts.cancelled} color="text-red-500"     />
      </div>

      {/* ── FILTERS ── */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 border
              ${filter === status
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}
          >
            {status}
            {status !== "all" && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${filter === status ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {bookings.filter((b) => b.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── SEARCH + SORT ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by service name…"
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          />
        </div>
        <select
          onChange={(e) => setSort(e.target.value)}
          className="sm:w-40 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* ── BOOKINGS LIST ── */}
      {processedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-500 font-medium">No bookings found</p>
          <p className="text-slate-400 text-sm mt-1">Try changing your filters or search term</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {processedBookings.map((booking) => {
            const meta = STATUS_META[booking.status] || STATUS_META.pending;
            return (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg shrink-0`}>
                      🔧
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800 leading-tight">
                        {booking.service?.name || "Service"}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {booking.provider?.name || "Provider"}
                      </p>
                    </div>
                  </div>

                  {/* status badge */}
                  <span className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${meta.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>

                {/* detail grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl mb-5">
                  <DetailRow label="Date"     value={formatDate(booking.scheduledDate)} />
                  <DetailRow label="Time"     value={booking.bookingTime} />
                  <DetailRow label="Provider" value={booking.provider?.name} />
                  <DetailRow label="Notes"    value={booking.notes} />
                </div>

                {/* actions */}
                <div className="flex gap-2">
                  {booking.status === "pending" && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 border border-red-200 text-xs font-semibold px-5 py-2 rounded-xl transition-colors"
                    >
                      {cancellingId === booking._id ? "Cancelling…" : "Cancel Booking"}
                    </button>
                  )}
                  {booking.status === "completed" && (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2 rounded-xl transition-colors"
                    >
                      ✍ Write Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── REVIEW MODAL ── */}
      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default CustomerBookings;