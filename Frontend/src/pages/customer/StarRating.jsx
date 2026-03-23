import { useState } from "react";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

const LABEL_COLORS = [
  "",
  "text-red-500",
  "text-orange-500",
  "text-amber-500",
  "text-blue-500",
  "text-emerald-600",
];

/**
 * StarRating
 * Props:
 *   rating    {number}   current selected rating (0–5)
 *   setRating {function} setter for rating
 *   size      {string}   "sm" | "md" (default) | "lg"
 *   readOnly  {boolean}  display-only mode (no interaction)
 */
const StarRating = ({ rating, setRating, size = "md", readOnly = false }) => {
  const [hover, setHover] = useState(0);

  const active = hover || rating;

  const sizeClasses = {
    sm: "text-xl gap-1",
    md: "text-3xl gap-1.5",
    lg: "text-4xl gap-2",
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">

      {/* stars row */}
      <div className={`flex ${sizeClasses[size ?? "md"]}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = active >= star;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => !readOnly && setRating?.(star)}
              onMouseEnter={() => !readOnly && setHover(star)}
              onMouseLeave={() => !readOnly && setHover(0)}
              aria-label={`Rate ${star} out of 5`}
              className={`
                leading-none transition-transform duration-100 focus:outline-none
                ${!readOnly ? "hover:scale-125 cursor-pointer" : "cursor-default"}
                ${filled ? "text-amber-400" : "text-slate-200"}
              `}
            >
              ★
            </button>
          );
        })}
      </div>

      {/* label (hidden in readOnly + sm size) */}
      {!readOnly && size !== "sm" && (
        <span
          className={`text-xs font-semibold transition-all duration-150 min-h-[16px]
            ${active ? LABEL_COLORS[active] : "text-slate-300"}`}
        >
          {LABELS[active] || "Tap to rate"}
        </span>
      )}
    </div>
  );
};

export default StarRating;