import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api/axios";

/* ── helpers ── */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_META = {
  approved: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
    label: "Approved",
  },
  pending: {
    badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
    label: "Pending",
  },
  rejected: {
    badge: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
    label: "Rejected",
  },
};

const FILTERS = ["all", "approved", "pending", "rejected"];

const EMPTY_MESSAGES = {
  all: "You haven't created any services yet.",
  approved: "You have no approved services.",
  pending: "You have no pending services.",
  rejected: "You have no rejected services.",
};

/* ── UI Components ── */
const FieldLabel = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
    {children}
  </p>
);

const StatBox = ({ label, value, color }) => (
  <div className="flex flex-col items-center gap-1 p-4 bg-slate-50 rounded-xl border border-slate-100">
    <span className={`text-xl font-bold ${color}`}>{value}</span>
    <span className="text-xs text-slate-400 font-medium">{label}</span>
  </div>
);

/* ═══════════════════════════════════════ */
const ProviderServices = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchServices(filter);
  }, [filter]);

  /* ================= FETCH SERVICES (🔥 FIXED) ================= */
  const fetchServices = async (status = "all") => {
    setLoading(true);
    try {
      const res = await API.get(
        `/services/my-services?status=${status}` // ✅ FIXED
      );

      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  /* counts */
  const counts = useMemo(
    () => ({
      approved: services.filter((s) => s.status === "approved").length,
      pending: services.filter((s) => s.status === "pending").length,
      rejected: services.filter((s) => s.status === "rejected").length,
    }),
    [services]
  );

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-600 text-white">
        <div className="relative flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Services</h1>
            <p className="text-blue-200 text-sm">
              Manage your listed services
            </p>
          </div>

          <button
            onClick={() => navigate("/provider/services/create")}
            className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold"
          >
            + Create
          </button>
        </div>

        {/* stats */}
        <div className="flex gap-3 mt-4">
          <StatBox label="Total" value={services.length} color="text-white" />
          <StatBox label="Approved" value={counts.approved} color="text-green-300" />
          <StatBox label="Pending" value={counts.pending} color="text-yellow-300" />
          <StatBox label="Rejected" value={counts.rejected} color="text-red-300" />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize border
              ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* EMPTY */}
      {services.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🛠️</div>
          <p className="text-slate-600">{EMPTY_MESSAGES[filter]}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => {
            const meta = STATUS_META[service.status] || STATUS_META.pending;

            return (
              <div
                key={service._id}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >
                {/* header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {service.name}
                    </h2>

                    {/* ✅ FIXED CATEGORY */}
                    <p className="text-sm text-indigo-600">
                      {service.category?.name || "No category"}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      ₹{service.price}
                    </p>
                  </div>

                  <span className={`px-3 py-1 text-xs rounded-full border ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>

                {/* location */}
                {service.location && (
                  <p className="text-sm text-slate-500 mt-2">
                    📍 {service.location?.area}, {service.location?.city}
                  </p>
                )}

                {/* date */}
                <p className="text-xs text-slate-400 mt-2">
                  Created: {formatDate(service.createdAt)}
                </p>

                {/* actions */}
                <div className="mt-4">
                  <button
                    onClick={() =>
                      navigate(`/provider/services/edit/${service._id}`)
                    }
                    className="text-xs text-indigo-600 font-semibold"
                  >
                    ✏ Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProviderServices;