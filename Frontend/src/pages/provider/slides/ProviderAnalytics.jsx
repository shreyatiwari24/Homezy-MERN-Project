import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { motion } from "framer-motion";

const ProviderAnalytics = () => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH ANALYTICS
  =============================== */

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const res = await API.get(
          "/provider/analytics"
        );

        setData(res.data);

      } catch (error) {

        console.error(
          "Analytics error:",
          error
        );

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

        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>

      </div>
    );
  }

  /* ===============================
     SAFE DATA
  =============================== */

  const stats = data?.stats || {};

  const monthly =
    data?.monthlyAnalytics || [];

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Provider Analytics
        </h1>

        <p className="text-gray-500">
          Track your performance and earnings
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">

        <StatCard
          title="Total Jobs"
          value={stats.totalJobs || 0}
        />

        <StatCard
          title="Completed"
          value={stats.completed || 0}
        />

        <StatCard
          title="Active Jobs"
          value={stats.active || 0}
        />

        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate || 0}%`}
        />

        <StatCard
          title="Total Earnings"
          value={`₹${stats.totalEarnings || 0}`}
        />

      </div>

      {/* ================= MONTHLY ================= */}

      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Monthly Performance
        </h2>

        {monthly.length === 0 ? (

          <p className="text-gray-500">
            No analytics data available
          </p>

        ) : (

          <div className="space-y-4">

            {monthly.map((month) => (

              <motion.div
                key={month.month}
                whileHover={{ scale: 1.01 }}
                className="
                flex
                justify-between
                items-center
                border
                rounded-xl
                p-4
                hover:shadow-md
                transition
                "
              >

                <div>

                  <p className="font-semibold">
                    {month.month}
                  </p>

                  <p className="text-sm text-gray-500">
                    Jobs Completed :
                    {" "}
                    {month.jobs || 0}
                  </p>

                </div>

                <p className="font-bold text-green-600">
                  ₹{month.earnings || 0}
                </p>

              </motion.div>

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

const StatCard = ({ title, value }) => (

  <motion.div
    whileHover={{ y: -4 }}
    className="
    bg-white
    p-6
    rounded-2xl
    shadow
    hover:shadow-lg
    transition
    "
  >

    <p className="text-gray-500 text-sm">
      {title}
    </p>

    <h3 className="text-2xl font-bold mt-2">
      {value}
    </h3>

  </motion.div>

);

export default ProviderAnalytics;