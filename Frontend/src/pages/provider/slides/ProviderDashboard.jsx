import { useEffect, useState, useCallback } from "react";
import API from "../../../api/axios";
import { Link } from "react-router-dom";

/* ── Stat Card ── */
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400",
    yellow: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 text-yellow-400",
    green:  "from-green-500/20 to-green-500/5  border-green-500/20  text-green-400",
    blue:   "from-blue-500/20  to-blue-500/5   border-blue-500/20   text-blue-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5`}>
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-bold text-[#7A8FBA] uppercase tracking-wider">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p
        className="text-3xl font-black text-[#EDF2FF] tracking-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {value}
      </p>
    </div>
  );
};

const ProviderDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [online, setOnline]     = useState(true);

  // ✅ Fixed: correct route /bookings/provider-bookings
  const fetchBookings = useCallback(async () => {
    try {
      const res = await API.get("/bookings/provider-bookings");
      // ✅ Fixed: read .bookings from response
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

  const getStatusStyle = (status) => {
    const styles = {
      completed: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
      pending:   "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
      accepted:  "bg-green-400/10 text-green-400 border border-green-400/20",
      rejected:  "bg-red-400/10 text-red-400 border border-red-400/20",
      cancelled: "bg-[#1F2D50] text-[#7A8FBA]",
    };
    return styles[status] || styles.pending;
  };

  if (loading) return (
    <div
      className="flex justify-center items-center h-[60vh]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-[#7A8FBA]">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div
      className="space-y-6 p-6 md:p-8"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#080C18] via-[#0D1224] to-[#1a2a4a] border border-[#1F2D50] rounded-2xl p-7">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-transparent" />
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="flex flex-col md:flex-row justify-between gap-6 relative">
          <div>
            <h1
              className="text-2xl md:text-3xl font-black text-[#EDF2FF] tracking-tight mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Provider Dashboard 🚀
            </h1>
            <p className="text-sm text-[#7A8FBA]">
              Manage your bookings and track your earnings
            </p>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center gap-3 self-start">
            <span className="text-sm text-[#7A8FBA] font-medium">Status:</span>
            <button
              onClick={() => setOnline(o => !o)}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
                online
                  ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                  : "bg-[#1F2D50] text-[#7A8FBA] border border-[#1F2D50] hover:border-[#3D4E70]"
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
        <StatCard title="Completed"   value={completed}    icon="✓"  color="blue"   />
        <StatCard title="Earnings"    value={`₹${earnings.toLocaleString("en-IN")}`} icon="💰" color="purple" />
      </div>

      {/* ── Upcoming job ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-orange-500 opacity-50" />
        <h2
          className="text-lg font-black text-[#EDF2FF] mb-5"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Upcoming Job
        </h2>

        {!upcoming ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm text-[#7A8FBA]">No upcoming bookings</p>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <p className="font-black text-[#EDF2FF] text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>
                {upcoming.service?.name}
              </p>
              <p className="text-sm text-[#7A8FBA] mt-1">
                Customer: {upcoming.customer?.name}
              </p>
              <p className="text-sm text-[#7A8FBA]">
                📅 {new Date(upcoming.scheduledDate).toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long"
                })}
                {upcoming.bookingTime && ` at ${upcoming.bookingTime}`}
              </p>
            </div>
            <Link
              to="/provider/bookings"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 transition-all shadow-lg shadow-orange-500/20"
            >
              View Job →
            </Link>
          </div>
        )}
      </div>

      {/* ── Recent bookings ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-500 opacity-50" />
        <div className="flex justify-between items-center mb-5">
          <h2
            className="text-lg font-black text-[#EDF2FF]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Recent Requests
          </h2>
          <Link
            to="/provider/bookings"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm text-[#7A8FBA]">No bookings yet</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1F2D50]">
            {bookings.slice(0, 5).map(b => (
              <div key={b._id} className="flex justify-between items-center py-4">
                <div>
                  <p className="font-bold text-[#EDF2FF] text-sm">{b.service?.name}</p>
                  <p className="text-xs text-[#7A8FBA] mt-0.5">
                    {b.customer?.name} · ₹{b.price}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusStyle(b.status)}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProviderDashboard;