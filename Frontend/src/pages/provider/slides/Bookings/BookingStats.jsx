const BookingStats = ({ bookings }) => {

  const total = bookings.length;

  const pending =
    bookings.filter(
      b => b.status === "pending"
    ).length;

  const completed =
    bookings.filter(
      b => b.status === "completed"
    ).length;

  // ✅ SAFE earnings calculation
  const earnings = bookings
    .filter(
      b => b.status === "completed"
    )
    .reduce(
      (acc, curr) =>
        acc +
        (
          curr.amount ||          // if exists
          curr.price ||           // booking price
          curr.service?.price ||  // service price
          0
        ),
      0
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <StatCard
        title="Total Bookings"
        value={total}
      />

      <StatCard
        title="Pending"
        value={pending}
      />

      <StatCard
        title="Completed"
        value={completed}
      />

      <StatCard
        title="Total Earnings"
        value={`₹${earnings}`}
      />

    </div>
  );
};

const StatCard = ({ title, value }) => (

  <div className="bg-white rounded-xl shadow-sm p-5">

    <p className="text-gray-500 text-sm">
      {title}
    </p>

    <h3 className="text-xl font-bold mt-2">
      {value}
    </h3>

  </div>

);

export default BookingStats;
