import { useState } from "react";

const BookingDetailsModal = ({
  booking,
  onClose,
  updateStatus
}) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-96 space-y-4">
        <h3 className="text-xl font-bold">
          {booking.service.name}
        </h3>

        <p><strong>Customer:</strong> {booking.customer.name}</p>
        <p><strong>Email:</strong> {booking.customer.email}</p>
        <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {booking.status}</p>

        {booking.status === "pending" && (
          <>
            <button
              onClick={() =>
                updateStatus(booking._id, "accepted")
              }
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Accept
            </button>

            <textarea
              placeholder="Rejection reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <button
              onClick={() =>
                updateStatus(booking._id, "rejected", reason)
              }
              className="w-full bg-red-600 text-white py-2 rounded"
            >
              Reject
            </button>
          </>
        )}

        {booking.status === "accepted" && (
          <button
            onClick={() =>
              updateStatus(booking._id, "completed")
            }
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Mark as Completed
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-300 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
