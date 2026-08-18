import { useEffect, useState } from "react";
import API from "../../../api/axios";

const ProviderEarnings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await API.get("/bookings/provider-bookings");
      // ✅ Handle both array and { bookings: [] } formats
      setBookings(res.data.bookings || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     COMPLETED BOOKINGS ONLY
  =============================== */
  const completedBookings = bookings.filter(b => b.status === "completed");

  /* ===============================
     TOTAL EARNINGS
  =============================== */
  const totalEarnings = completedBookings.reduce(
    (acc, curr) => acc + (curr.amount || curr.price || curr.service?.price || 0),
    0
  );

  /* ===============================
     MONTHLY EARNINGS
  =============================== */
  const currentMonth = new Date().getMonth();
  const monthlyEarnings = completedBookings
    .filter(b => new Date(b.updatedAt || b.scheduledDate).getMonth() === currentMonth)
    .reduce(
      (acc, curr) => acc + (curr.amount || curr.price || curr.service?.price || 0),
      0
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 py-8 md:px-0">
      
      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-400 to-blue-500" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-2">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Financial Overview</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Your Earnings
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track your completed jobs and total revenue.</p>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Earnings"
          value={`₹${totalEarnings.toLocaleString("en-IN")}`}
        />
        <StatCard
          title="This Month"
          value={`₹${monthlyEarnings.toLocaleString("en-IN")}`}
        />
        <StatCard
          title="Completed Jobs"
          value={completedBookings.length}
        />
      </div>

      {/* ================= EARNINGS TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <h2 className="text-base font-bold text-gray-800 mb-6">Earnings History</h2>

        {completedBookings.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-500 font-medium">No earnings yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest">
                  <th className="py-3 px-4 font-bold">Service</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {completedBookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-gray-700">
                      {booking.service?.name || "Service"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                      {booking.customer?.name || "—"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 font-medium">
                      {new Date(booking.updatedAt || booking.scheduledDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600 text-right">
                      ₹{booking.amount || booking.price || booking.service?.price || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ===============================
   STAT CARD
================================ */
const StatCard = ({ title, value }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden flex flex-col gap-2">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-400 to-blue-500" />
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </p>
      <h2 className="text-3xl font-bold text-gray-800">
        {value}
      </h2>
    </div>
  );
};

export default ProviderEarnings;