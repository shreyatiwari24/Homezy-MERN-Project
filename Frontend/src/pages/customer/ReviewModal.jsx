import { useState } from "react";
import API from "../../api/axios";
import StarRating from "./StarRating";
import toast from "react-hot-toast";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const ReviewModal = ({ booking, onClose }) => {
  const [rating,      setRating]      = useState(0);
  const [hovered,     setHovered]     = useState(0);
  const [comment,     setComment]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  const active = hovered || rating;

  const submitReview = async () => {
    if (!rating) { toast.error("Please select a star rating"); return; }
    try {
      setSubmitting(true);
      await API.post("/reviews", {
        bookingId: booking._id,
        rating,
        comment,
      });
      toast.success("Review submitted!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  /* close on backdrop click */
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeUp">

        {/* ── header strip ── */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-600 px-7 pt-7 pb-8 text-white">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            ✕
          </button>
          <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">Leave a review</p>
          <h2 className="text-lg font-bold leading-snug pr-8">
            {booking.service?.name || "Service"}
          </h2>
          {booking.provider?.name && (
            <p className="text-blue-200 text-sm mt-0.5">by {booking.provider.name}</p>
          )}
        </div>

        {/* ── body ── */}
        <div className="px-7 py-6 space-y-6">

          {/* star rating */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-3xl transition-transform duration-100 hover:scale-110 focus:outline-none"
                >
                  <span className={star <= active ? "text-amber-400" : "text-slate-200"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <span className={`text-xs font-semibold transition-colors duration-150 ${
              active >= 4 ? "text-emerald-600"
              : active >= 3 ? "text-blue-600"
              : active >= 1 ? "text-amber-600"
              : "text-slate-300"
            }`}>
              {RATING_LABELS[active] || "Tap to rate"}
            </span>
          </div>

          {/* comment box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Your Experience
            </label>
            <textarea
              placeholder="What did you like or dislike about the service?"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition resize-none text-slate-700 placeholder:text-slate-400"
            />
            <p className="text-right text-xs text-slate-400">{comment.length} / 500</p>
          </div>

          {/* actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitReview}
              disabled={submitting || !rating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeUp { animation: fadeUp 0.25s ease both; }
      `}</style>
    </div>
  );
};

export default ReviewModal;