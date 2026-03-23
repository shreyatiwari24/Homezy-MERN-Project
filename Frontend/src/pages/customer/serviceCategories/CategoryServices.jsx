import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../../../api/axios";
import { LocationContext } from "../../../context/LocationContext";
import LocationModal from "../../../components/location/LocationModal";

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-[#1F2D50]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-[#1F2D50] rounded-full w-3/4" />
      <div className="h-3 bg-[#1F2D50] rounded-full w-full" />
      <div className="h-3 bg-[#1F2D50] rounded-full w-2/3" />
      <div className="h-8 bg-[#1F2D50] rounded-xl mt-4" />
    </div>
  </div>
);

const CategoryServices = () => {
  const { slug }     = useParams();
  const navigate     = useNavigate();
  const { location } = useContext(LocationContext);

  const [services, setServices]                   = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);

  /* ── Same hasValidLocation check as Services.jsx ── */
  const hasValidLocation =
    location &&
    (
      (Array.isArray(location.coordinates) && location.coordinates.length === 2) ||
      location.pincode
    );

  /* ── Restore location on mount — same as Services.jsx ── */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("location"));
      if (saved) window.dispatchEvent(new Event("locationChanged"));
    } catch { /* ignore */ }
  }, []);

  /* ── Main fetch effect — same deps as Services.jsx ── */
  useEffect(() => {
    if (!hasValidLocation) {
      setLoading(false);
      return;
    }
    fetchServices();
    window.scrollTo(0, 0);
  }, [slug, location]);

  /* ── locationChanged event listener — same as Services.jsx ── */
  useEffect(() => {
    const handler = () => {
      const saved = JSON.parse(localStorage.getItem("location"));
      if (saved) fetchServices();
    };
    window.addEventListener("locationChanged", handler);
    return () => window.removeEventListener("locationChanged", handler);
  }, [slug]);

  /* ── Auto-show modal if no location — same as Services.jsx ── */
  useEffect(() => {
    if (!hasValidLocation) setShowLocationModal(true);
  }, [hasValidLocation]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      // ✅ category from slug — same as Services.jsx category param
      if (slug) params.append("category", slug);

      // ✅ geo-radius filter — exact same priority logic as Services.jsx
      if (
        Array.isArray(location?.coordinates) &&
        location.coordinates.length === 2
      ) {
        const [lng, lat] = location.coordinates;
        params.append("lat", lat);
        params.append("lng", lng);
      }
      // ✅ pincode fallback — same as Services.jsx
      else if (location?.pincode) {
        params.append("pincode", location.pincode.trim());
      }

      const res = await API.get(`/services?${params.toString()}`);
      setServices(
        Array.isArray(res.data) ? res.data : res.data.services || []
      );

    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Format slug for display ── */
  const categoryTitle = slug
    ?.split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  /* ── No location — same pattern as Services.jsx ── */
  if (!hasValidLocation) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-[#080C18] px-6 gap-6"
        
      >
        <div className="text-5xl">📍</div>
        <h2
          className="text-2xl font-black text-[#EDF2FF] text-center"
          
        >
          Set your location first
        </h2>
        <p className="text-sm text-[#7A8FBA] text-center max-w-sm">
          We need your location to show {categoryTitle} services available near you.
        </p>
        <button
          onClick={() => setShowLocationModal(true)}
          className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 transition-all shadow-lg shadow-orange-500/20"
        >
          Set Location →
        </button>
        {showLocationModal && (
          <LocationModal
            close={() => setShowLocationModal(false)}
            onConfirm={() => { setShowLocationModal(false); fetchServices(); }}
          />
        )}
      </div>
    );
  }

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div
        className="min-h-screen pt-28 pb-24 px-6 bg-gradient-to-b from-[#080C18] via-[#0D1224] to-[#080C18]"
        
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 space-y-3">
            <div className="h-8 w-64 bg-[#1F2D50] rounded-full animate-pulse" />
            <div className="h-4 w-48 bg-[#1F2D50] rounded-full animate-pulse" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Main UI ── */
  return (
    <section
      className="min-h-screen pt-28 pb-24 px-6 bg-gradient-to-b from-[#080C18] via-[#0D1224] to-[#080C18]"
      
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/categories")}
            className="flex items-center gap-2 text-sm text-[#7A8FBA] hover:text-[#EDF2FF] transition-colors mb-6"
          >
            ← All Categories
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-orange-500 to-blue-500" />
                <h1
                  className="text-3xl md:text-4xl font-black text-[#EDF2FF] tracking-tight capitalize"
                  
                >
                  {categoryTitle} Services
                </h1>
              </div>
              <p className="text-sm text-[#7A8FBA] pl-4">
                {location?.city
                  ? `Near ${location.area ? `${location.area}, ` : ""}${location.city}`
                  : "All locations"}
                {" · "}
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                >
                  Change location
                </button>
              </p>
            </div>

            {services.length > 0 && (
              <span className="text-xs font-bold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-4 py-2 rounded-full self-start md:self-auto">
                {services.length} service{services.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>
        </div>

        {/* Location banner */}
        {location?.city && (
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-2.5 rounded-xl mb-6">
            <span>📍</span>
            Showing {categoryTitle} services within 10km of{" "}
            {location.area ? `${location.area}, ` : ""}{location.city}
            {location.pincode ? ` — ${location.pincode}` : ""}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm font-semibold">
            <span>⚠</span> {error}
            <button
              onClick={fetchServices}
              className="ml-auto text-orange-400 hover:text-orange-300 font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && services.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="text-5xl">🔍</div>
            <h2
              className="text-xl font-black text-[#EDF2FF]"
              
            >
              No services found nearby
            </h2>
            <p className="text-sm text-[#7A8FBA] max-w-sm">
              No {categoryTitle} services are available near{" "}
              {location?.city || "your location"} yet.
            </p>
            <div className="flex gap-3 mt-2 flex-wrap justify-center">
              <button
                onClick={() => setShowLocationModal(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#7A8FBA] border border-[#1F2D50] hover:border-orange-500/40 hover:text-[#EDF2FF] transition-all"
              >
                Change Location
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 transition-all"
              >
                Browse Categories →
              </button>
            </div>
          </div>
        )}

        {/* Service cards */}
        {services.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="group relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Image */}
                <div className="relative h-44 bg-[#0D1224] overflow-hidden flex-shrink-0">
                  {service.images?.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#3D4E70] gap-2">
                      <span className="text-4xl">🛠</span>
                      <span className="text-xs">No image</span>
                    </div>
                  )}

                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-orange-500 text-white font-black text-sm px-3 py-1 rounded-full shadow-lg">
                    ₹{service.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 gap-2">
                  <h3
                    className="font-black text-[15px] text-[#EDF2FF] leading-snug line-clamp-1 group-hover:text-orange-400 transition-colors"
                    
                  >
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#7A8FBA] line-clamp-2 leading-relaxed flex-1">
                    {service.description || "No description available"}
                  </p>

                  {/* Location */}
                  <p className="text-xs text-[#3D4E70] flex items-center gap-1">
                    <span>📍</span>
                    {service.location?.area ? `${service.location.area}, ` : ""}
                    {service.location?.city || "N/A"}
                    {service.location?.pincode ? ` — ${service.location.pincode}` : ""}
                  </p>

                  {/* Provider */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">
                      {service.provider?.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <span className="text-xs text-[#7A8FBA] truncate">
                      {service.provider?.name || "Unknown Provider"}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(`/services/${service._id}`)}
                    className="mt-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 transition-all shadow-lg shadow-orange-500/10"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          close={() => setShowLocationModal(false)}
          onConfirm={() => { setShowLocationModal(false); fetchServices(); }}
        />
      )}

    </section>
  );
};

export default CategoryServices;