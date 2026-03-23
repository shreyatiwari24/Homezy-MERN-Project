import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../api/axios";

/* ── Icons ── */
const ICON_MAP = {
  plumbing: "🔧",
  electrician: "⚡",
  cleaning: "🧹",
  carpentry: "🪚",
  painting: "🎨",
  "ac repair": "❄️",
  "appliance repair": "🔌",
  other: "🏠",
};

const getCategoryIcon = (cat) => {
  const name = (cat.name || "").toLowerCase();

  // If API sends emoji → use it
  if (cat.icon && cat.icon.length <= 2) return cat.icon;

  // Fallback mapping (more flexible)
  if (name.includes("plumb")) return "🔧";
  if (name.includes("electric")) return "⚡";
  if (name.includes("clean")) return "🧹";
  if (name.includes("paint")) return "🎨";
  if (name.includes("carp")) return "🪚";
  if (name.includes("ac")) return "❄️";
  if (name.includes("appliance")) return "🔌";

  return "🛠";
};

/* ── Skeleton ── */
const SkeletonCard = () => (
  <div className="animate-pulse rounded-2xl p-6 bg-[#0D1224]/60 border border-[#1F2D50] backdrop-blur-md">
    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#1F2D50]" />
    <div className="h-3 w-2/3 mx-auto rounded bg-[#1F2D50]" />
  </div>
);

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/services/categories");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-[#080C18] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-5">

        {/* ───── HEADER ───── */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">
            All Services
          </p>

          <h1 className="text-4xl md:text-5xl font-black leading-tight">
            Find the service you need{" "}
            <span className="bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
              instantly
            </span>
          </h1>

          <p className="text-[#94A9D1] mt-4 max-w-lg mx-auto">
            Discover trusted professionals for every job — fast, reliable, and nearby.
          </p>
        </div>

        {/* ───── SEARCH ───── */}
        {!loading && (
          <div className="mb-10">
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-[#0D1224]/70 border border-[#1F2D50] backdrop-blur-md text-sm placeholder-[#5E729F] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        )}

        {/* ───── ERROR ───── */}
        {error && (
          <div className="text-center text-red-400 mb-10">
            ⚠ {error}
          </div>
        )}

        {/* ───── GRID ───── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">

          {/* Loading */}
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4 animate-bounce">📭</div>
              <p className="font-bold text-lg">No results found</p>
              <p className="text-[#7A8FBA] text-sm">
                Try a different keyword
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading &&
            filtered.map((cat, i) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="group relative cursor-pointer rounded-2xl p-[1px] bg-gradient-to-br from-orange-500/20 via-transparent to-blue-500/20 hover:from-orange-500 hover:to-blue-500 transition-all duration-300"
              >
                <div className="relative bg-[#0D1224]/80 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-10px_rgba(255,115,0,0.3)] active:scale-95">

                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-orange-500/10 to-blue-500/10" />

                  {/* Icon */}
                  <div className="w-14 h-14 flex items-center justify-center text-2xl rounded-xl bg-[#080C18] border border-[#1F2D50] group-hover:scale-110 group-hover:rotate-6 transition">
                    {getCategoryIcon(cat)}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-sm group-hover:text-white text-[#A8B5D9] transition">
                    {cat.name}
                  </h3>

                  {/* Count */}
                  {cat.count && (
                    <p className="text-xs text-[#5E729F]">
                      {cat.count} services
                    </p>
                  )}

                  {/* Hover CTA */}
                  <span className="text-xs text-orange-400 opacity-0 group-hover:opacity-100 transition">
                    Explore →
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* ───── CTA ───── */}
        {!loading && categories.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-orange-500 to-blue-500">
              <div className="bg-[#0D1224] px-10 py-8 rounded-2xl">
                <p className="text-[#94A9D1] mb-4 text-sm">
                  Can't find what you're looking for?
                </p>

                <button
                  onClick={() => navigate("/contact")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-blue-500 hover:opacity-90 text-sm font-bold transition"
                >
                  Contact Us →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Categories;