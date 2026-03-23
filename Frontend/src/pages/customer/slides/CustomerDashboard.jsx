import { useEffect, useState, useCallback, useContext } from "react";
import API from "../../../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

/* ── helpers ── */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getCountdown = (date, now) => {
  const diff = new Date(date) - now;
  if (diff <= 0) return { label: "Starting soon", urgent: true };
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days === 0) return { label: `${hours}h remaining`, urgent: true };
  return { label: `${days}d ${hours}h remaining`, urgent: false };
};

/* ── STAT CARD ── */
const STAT_STYLES = {
  indigo: { icon: "bg-indigo-50 text-indigo-600",  value: "text-indigo-700"  },
  green:  { icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-700" },
  yellow: { icon: "bg-yellow-50 text-yellow-600",  value: "text-yellow-700"  },
  blue:   { icon: "bg-blue-50 text-blue-600",      value: "text-blue-700"    },
  purple: { icon: "bg-purple-50 text-purple-600",  value: "text-purple-700"  },
};

const STAT_ICONS = {
  Total:     "📋",
  Active:    "⚡",
  Pending:   "⏳",
  Completed: "✅",
  Spent:     "💰",
};

const StatCard = ({ title, value, color }) => {
  const s = STAT_STYLES[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${s.icon}`}>
        {STAT_ICONS[title] || title[0]}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${s.value}`}>{value}</p>
      </div>
    </div>
  );
};

/* ── RECENT BOOKING ROW ── */
const STATUS_META = {
  pending:   { dot: "bg-yellow-400",  badge: "bg-yellow-50 text-yellow-700 border-yellow-200"    },
  accepted:  { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200"  },
  completed: { dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 border-blue-200"           },
  cancelled: { dot: "bg-red-400",     badge: "bg-red-50 text-red-600 border-red-200"              },
};

const BookingRow = ({ booking }) => {
  const meta = STATUS_META[booking.status] || STATUS_META.pending;
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-base shrink-0">🔧</div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{booking.service?.name || "Service"}</p>
          <p className="text-xs text-slate-400">{formatDate(booking.scheduledDate)}</p>
        </div>
      </div>
      <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${meta.badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
        {booking.status}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [now, setNow] = useState(new Date());

  /* live clock (1 min tick) */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings/my-bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Booking fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  /* ── stats ── */
  const totalBookings = bookings.length;
  const completed     = bookings.filter((b) => b.status === "completed").length;
  const pending       = bookings.filter((b) => b.status === "pending").length;
  const active        = bookings.filter((b) => b.status === "accepted").length;
  const totalSpent    = bookings
    .filter((b) => b.status === "completed")
    .reduce((acc, curr) => acc + (curr.price || 0), 0);

  /* ── upcoming ── */
  const upcoming = bookings
    .filter((b) => b.status === "accepted" && new Date(b.scheduledDate) >= now)
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))[0];

  /* ── recent (last 5) ── */
  const recent = [...bookings]
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
    .slice(0, 5);

  const countdown = upcoming ? getCountdown(upcoming.scheduledDate, now) : null;

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-600 text-white">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 right-24 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">
              {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-blue-200 text-sm mt-1">Here's what's happening with your bookings.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/services"
              className="bg-white text-indigo-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              + Book Service
            </Link>
            <Link
              to="/customer/bookings"
              className="bg-white/10 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total"     value={totalBookings}  color="indigo" />
        <StatCard title="Active"    value={active}         color="green"  />
        <StatCard title="Pending"   value={pending}        color="yellow" />
        <StatCard title="Completed" value={completed}      color="blue"   />
        <StatCard title="Spent"     value={`₹${totalSpent.toLocaleString("en-IN")}`} color="purple" />
      </div>

      {/* ── UPCOMING + RECENT (2-col on lg) ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Upcoming service (wider col) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Upcoming Service</h2>

          {!upcoming ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-sm text-slate-500 font-medium">No upcoming services</p>
              <Link to="/services" className="mt-3 text-xs font-semibold text-indigo-600 hover:underline">
                Browse & book one →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* service info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl shrink-0">🔧</div>
                <div>
                  <p className="font-semibold text-slate-800">{upcoming.service?.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">by {upcoming.provider?.name}</p>
                </div>
              </div>

              {/* details */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4">
                {[
                  { label: "Date", value: formatDate(upcoming.scheduledDate) },
                  { label: "Time", value: upcoming.bookingTime || "—" },
                  { label: "Provider", value: upcoming.provider?.name },
                  { label: "Notes", value: upcoming.notes || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* countdown pill */}
              <div className={`self-start flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border
                ${countdown?.urgent
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"}`}
              >
                <span>{countdown?.urgent ? "🔔" : "⏱"}</span>
                {countdown?.label}
              </div>
            </div>
          )}
        </div>

        {/* Recent bookings (narrower col) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Recent</h2>
            <Link to="/customer/bookings" className="text-xs font-semibold text-indigo-600 hover:underline">
              See all →
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No bookings yet.</p>
          ) : (
            <div>
              {recent.map((b) => <BookingRow key={b._id} booking={b} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;