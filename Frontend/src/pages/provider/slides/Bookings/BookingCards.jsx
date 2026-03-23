const BookingCards = ({ bookings, setSelectedBooking }) => {
  if (bookings.length === 0) {
    return (
      <div className="bg-white p-8 rounded shadow text-center text-gray-500">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          onClick={() => setSelectedBooking(booking)}
          className="bg-white p-5 rounded shadow cursor-pointer hover:shadow-md transition"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">
              {booking.service.name}
            </h3>
            <span className="capitalize text-sm">
              {booking.status}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            {booking.customer.name}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(booking.bookingDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BookingCards;
