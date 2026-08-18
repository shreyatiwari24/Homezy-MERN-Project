import { useEffect, useState } from "react";
import API from "../../../api/axios";

const ProviderAnalytics = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH ANALYTICS
  =============================== */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/provider/analytics");
        setData(res.data);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  /* ===============================
     LOADING UI
  =============================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  /* ===============================
     SAFE DATA
  =============================== */
  const stats = data || {};
  const monthly = data?.monthly || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4 py-8 md:px-0">

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-400 to-blue-500" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-2">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Performance Overview</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Provider Analytics
            </h1>
            <p className="text-gray-500 text-sm mt-1">Monitor your ratings, completion rates, and monthly growth.</p>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs || 0}
        />
        <StatCard
          title="Completed"
          value={stats.completed || 0}
        />
        <StatCard
          title="Rating"
          value={`${stats.rating || 0} ⭐`}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate || 0}%`}
        />
        <StatCard
          title="Total Earnings"
          value={`₹${(stats.totalEarnings || 0).toLocaleString("en-IN")}`}
        />
      </div>

      {/* ================= MONTHLY ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <h2 className="text-base font-bold text-gray-800 mb-6">Monthly Performance</h2>

        {monthly.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-500 font-medium">No analytics data available yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthly.map((month, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:shadow-sm hover:border-orange-200 transition-all bg-gray-50/30"
              >
                <div>
                  <p className="font-bold text-gray-700">
                    {month.month || "Current Month"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                    Jobs Completed: {month.jobs || 0}
                  </p>
                </div>
                <p className="font-bold text-emerald-600 text-lg">
                  ₹{(month.earnings || 0).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
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
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 overflow-hidden flex flex-col gap-2">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-400 to-blue-500" />
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-gray-800">
        {value}
      </h3>
    </div>
  );
};

export default ProviderAnalytics;