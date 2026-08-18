import { useEffect, useState, useCallback, useContext } from "react";
import API from "../../../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

/* ── Stat Card ── */
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    orange: "border-l-orange-400 bg-orange-50",
    yellow: "border-l-yellow-400 bg-yellow-50",
    green:  "border-l-emerald-400 bg-emerald-50",
    blue:   "border-l-blue-400 bg-blue-50",
    purple: "border-l-purple-400 bg-purple-50",
  };

  const textColors = {
    orange: "text-orange-600",
    yellow: "text-yellow-600",
    green:  "text-emerald-600",
    blue:   "text-blue-600",
    purple: "text-purple-600",
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${colors[color]} p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3`}>
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${colors[color]} ${textColors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</p>
        <p className={`text-2xl font-bold mt-0.5 ${textColors[color]}`}>{value}</p>
      </div>
    </div>
  );
};

/* ── Status badge style ── */
const getStatusStyle = (status) => {
  const styles = {
    completed: "bg-blue-50 text-blue-600",
    pending:   "bg-yellow-50 text-yellow-600",
    accepted:  "bg-emerald-50 text-emerald-600",
    rejected:  "bg-red-50 text-red-600",
    cancelled: "bg-gray-100 text-gray-500",
  };
  return styles[status] || styles.pending;
};

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [online, setOnline]     = useState(true);
  const [now, setNow] = useState(new Date());

  /* live clock (1 min tick) */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await API.get("/bookings/provider-bookings");
      setBookings(res.data.bookings || res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  /* ── Stats ── */
  const totalJobs  = bookings.length;
  const pending    = bookings.filter(b => b.status === "pending").length;
  const active     = bookings.filter(b => ["accepted", "in-progress"].includes(b.status)).length;
  const completed  = bookings.filter(b => b.status === "completed").length;
  const earnings   = bookings
    .filter(b => b.status === "completed")
    .reduce((acc, b) => acc + (b.price || 0), 0);

  /* ── Upcoming job ── */
  const upcoming = bookings
    .filter(b => b.status === "accepted" && new Date(b.scheduledDate) >= new Date())
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))[0];

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-400 to-blue-500" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-2">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Provider"} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here's an overview of your provider activities.</p>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-gray-400 font-medium">Status:</span>
            <button
              onClick={() => setOnline(o => !o)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                online
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                  : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {online ? "🟢 Online" : "⚫ Offline"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Jobs"  value={totalJobs}    icon="📋" color="orange" />
        <StatCard title="Pending"     value={pending}      icon="⏳" color="yellow" />
        <StatCard title="Active"      value={active}       icon="⚡" color="green"  />
        <StatCard title="Completed"   value={completed}    icon="✅" color="blue"   />
        <StatCard title="Earnings"    value={`₹${earnings.toLocaleString("en-IN")}`} icon="💰" color="purple" />
      </div>

      {/* ── UPCOMING + RECENT (2-col on lg) ── */}
      <div className="grid lg:grid-cols-5 gap-5">
        
        {/* Upcoming job */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-orange-400 to-blue-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Upcoming Job
            </h2>
          </div>

          {!upcoming ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-gray-200 rounded-xl">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-sm text-gray-500 font-medium">No upcoming bookings</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl shrink-0">🔧</div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{upcoming.service?.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">for {upcoming.customer?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                {[
                  { label: "Date", value: new Date(upcoming.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                  { label: "Time", value: upcoming.bookingTime || "—" },
                  { label: "Location", value: upcoming.address || "—" },
                  { label: "Price", value: `₹${upcoming.price || 0}` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <div className="self-start">
                <Link
                  to="/provider/bookings"
                  className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-blue-500 hover:opacity-90 transition-opacity shadow-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-orange-400 to-blue-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Recent Requests
              </h2>
            </div>
            <Link
              to="/provider/bookings"
              className="text-xs font-semibold text-orange-500 hover:underline transition-colors"
            >
              See all →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No bookings yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {bookings.slice(0, 5).map(b => (
                <div key={b._id} className="flex items-center justify-between py-3.5 gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-base shrink-0">🔧</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{b.service?.name}</p>
                      <p className="text-xs text-gray-400">{b.customer?.name} · ₹{b.price}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(b.status)}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProviderDashboard;
