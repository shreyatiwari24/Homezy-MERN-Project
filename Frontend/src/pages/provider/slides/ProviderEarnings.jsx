import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { motion } from "framer-motion";

const ProviderEarnings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {

    try {

      const res = await API.get(
        "/bookings/provider-bookings"
      );

      setBookings(res.data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

  };

  /* ===============================
     COMPLETED BOOKINGS ONLY
  =============================== */

  const completedBookings =
    bookings.filter(
      b => b.status === "completed"
    );

  /* ===============================
     TOTAL EARNINGS
  =============================== */

  const totalEarnings =
    completedBookings.reduce(
      (acc, curr) =>
        acc +
        (
          curr.amount ||
          curr.price ||
          curr.service?.price ||
          0
        ),
      0
    );

  /* ===============================
     MONTHLY EARNINGS
  =============================== */

  const currentMonth =
    new Date().getMonth();

  const monthlyEarnings =
    completedBookings
      .filter(b =>
        new Date(
          b.updatedAt
        ).getMonth() === currentMonth
      )
      .reduce(
        (acc, curr) =>
          acc +
          (
            curr.amount ||
            curr.price ||
            curr.service?.price ||
            0
          ),
        0
      );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">

        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>

      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Earnings Overview
      </h1>

      {/* ================= STATS ================= */}

      <div className="grid md:grid-cols-3 gap-6">

        <StatCard
          title="Total Earnings"
          value={`₹${totalEarnings}`}
        />

        <StatCard
          title="This Month"
          value={`₹${monthlyEarnings}`}
        />

        <StatCard
          title="Completed Jobs"
          value={completedBookings.length}
        />

      </div>

      {/* ================= EARNINGS TABLE ================= */}

      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-semibold mb-6">
          Earnings History
        </h2>

        {completedBookings.length === 0 ? (

          <p className="text-gray-500">
            No earnings yet.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="py-3">
                    Service
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody>

                {completedBookings.map(
                  booking => (

                    <tr
                      key={booking._id}
                      className="border-b"
                    >

                      <td className="py-3">
                        {booking.service?.name}
                      </td>

                      <td>
                        {booking.customer?.name}
                      </td>

                      <td>
                        {new Date(
                          booking.updatedAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="font-semibold text-green-600">

                        ₹
                        {booking.amount ||
                          booking.price ||
                          booking.service
                            ?.price ||
                          0}

                      </td>

                    </tr>

                  )
                )}

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

    <p className="text-gray-500">
      {title}
    </p>

    <h2 className="text-2xl font-bold mt-2">
      {value}
    </h2>

  
</motion.div>
);

export default ProviderEarnings;