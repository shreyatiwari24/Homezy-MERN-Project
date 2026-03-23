import { useEffect, useState, useMemo } from "react";
import API from "../../../api/axios";
import ReviewModal from "../ReviewModal";
import StarRating from "../StarRating";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ── tab IDs ── */
const TABS = [
  { id: "pending", label: "Awaiting Review" },
  { id: "given",   label: "My Reviews"      },
];

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const CustomerReviews = () => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [myReviews,         setMyReviews]         = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [selectedBooking,   setSelectedBooking]   = useState(null);
  const [activeTab,         setActiveTab]         = useState("pending");

  useEffect(() => {
    fetchAll();
  }, []);

 const fetchAll = async () => {
  try {
    setLoading(true);

    const [bookingsRes, reviewsRes] = await Promise.all([
      API.get("/bookings/my-bookings"),
      API.get("/reviews/my"), // ✅ fixed route
    ]);

    setCompletedBookings(
      bookingsRes.data.filter((b) => b.status === "completed")
    );

    setMyReviews(reviewsRes.data.reviews || []); // ✅ fixed data

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  /* bookings that already have a review */
  const reviewedBookingIds = useMemo(
  () => new Set(myReviews.map((r) => r.booking?._id || r.booking)),
  [myReviews]
);

  /* bookings still awaiting a review */
  const pendingReview = useMemo(
    () => completedBookings.filter((b) => !reviewedBookingIds.has(b._id)),
    [completedBookings, reviewedBookingIds]
  );

  /* after submitting a review, refresh both lists */
  const handleReviewClose = () => {
    setSelectedBooking(null);
    fetchAll();
  };

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-600 text-white">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-6 right-16 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-bold mb-1">Reviews</h1>
          <p className="text-blue-200 text-sm">Share your experience and read past feedback.</p>
          {/* quick counts */}
          <div className="flex gap-4 mt-5">
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">{myReviews.length}</p>
              <p className="text-xs text-blue-200">Given</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">{pendingReview.length}</p>
              <p className="text-xs text-blue-200">Awaiting</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">
                {myReviews.length
                  ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
                  : "—"}
              </p>
              <p className="text-xs text-blue-200">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200
              ${activeTab === tab.id
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"}`}
          >
            {tab.label}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold
              ${activeTab === tab.id
                ? "bg-indigo-50 text-indigo-500"
                : "bg-slate-200 text-slate-500"}`}>
              {tab.id === "pending" ? pendingReview.length : myReviews.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── AWAITING REVIEW ── */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingReview.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-slate-600 font-semibold">All caught up!</p>
              <p className="text-slate-400 text-sm mt-1">You've reviewed all your completed services.</p>
            </div>
          ) : (
            pendingReview.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">🔧</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{booking.service?.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {booking.provider?.name} · {formatDate(booking.scheduledDate)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  ✍ Review
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── MY REVIEWS ── */}
      {activeTab === "given" && (
        <div className="space-y-4">
          {myReviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-slate-600 font-semibold">No reviews yet</p>
              <p className="text-slate-400 text-sm mt-1">Reviews you write will appear here.</p>
              <button
                onClick={() => setActiveTab("pending")}
                className="mt-4 text-xs font-semibold text-indigo-600 hover:underline"
              >
                Write your first review →
              </button>
            </div>
          ) : (
            myReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-xl shrink-0">⭐</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {review.booking?.service?.name || "Service"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {review.booking?.provider?.name || "Provider"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{formatDate(review.createdAt)}</span>
                </div>

                {/* stars */}
                <StarRating rating={review.rating} readOnly size="sm" />

                {/* comment */}
                {review.comment && (
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 leading-relaxed">
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── REVIEW MODAL ── */}
      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={handleReviewClose}
        />
      )}
    </div>
  );
};

export default CustomerReviews;