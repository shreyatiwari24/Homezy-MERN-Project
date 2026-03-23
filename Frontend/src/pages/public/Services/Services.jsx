import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../../../api/axios";
import { LocationContext } from "../../../context/LocationContext";
import LocationModal from "../../../components/location/LocationModal";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const { location } = useContext(LocationContext);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  /* ================= LOAD LOCATION FROM STORAGE ================= */

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("location"));

      if (saved) {
        window.dispatchEvent(new Event("locationChanged"));
      }
    } catch (err) {
      console.error("Location load error:", err);
    }
  }, []);

  /* ================= HELPER ================= */

  const hasValidLocation =
    location &&
    (
      (Array.isArray(location.coordinates) &&
        location.coordinates.length === 2) ||
      location.pincode
    );

  /* ================= FETCH SERVICES ================= */

  const fetchServices = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (searchQuery) params.append("search", searchQuery);

      /* 🔥 GEO FILTER */
      if (
        Array.isArray(location?.coordinates) &&
        location.coordinates.length === 2
      ) {
        const [lng, lat] = location.coordinates;

        params.append("lat", lat);
        params.append("lng", lng);
      }

      /* 🔥 PINCODE FILTER */
      else if (location?.pincode) {
        params.append("pincode", location.pincode.trim());
      }

      const url = `/services?${params.toString()}`;

      const res = await API.get(url);

      setServices(
        Array.isArray(res.data)
          ? res.data
          : res.data.services || []
      );

    } catch (error) {
      console.error("Service fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MAIN EFFECT ================= */

  useEffect(() => {
    if (!hasValidLocation) {
      setLoading(false);
      return;
    }

    fetchServices();
  }, [category, searchQuery, location]);

  /* ================= LOCATION EVENT LISTENER ================= */

  useEffect(() => {
    const handler = () => {
      const saved = JSON.parse(localStorage.getItem("location"));

      if (saved) {
        fetchServices();
      }
    };

    window.addEventListener("locationChanged", handler);

    return () =>
      window.removeEventListener("locationChanged", handler);
  }, []);

  /* ================= AUTO SHOW LOCATION MODAL ================= */

  useEffect(() => {
    if (!hasValidLocation) {
      setShowLocationModal(true);
    }
  }, [hasValidLocation]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0b1f3a] text-white">
        Loading services...
      </div>
    );
  }

  /* ================= NO LOCATION ================= */

  if (!hasValidLocation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b1f3a] text-white">
        <h2 className="text-2xl font-semibold mb-4">
          📍 Please set your location
        </h2>

        <button
          onClick={() => setShowLocationModal(true)}
          className="bg-orange-500 px-6 py-3 rounded-lg hover:bg-orange-600"
        >
          Set Location
        </button>

        {showLocationModal && (
          <LocationModal close={() => setShowLocationModal(false)} />
        )}
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <section className="min-h-screen pt-32 pb-20 px-8 bg-gradient-to-b from-[#0b1f3a] via-[#0f172a] to-black text-white">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-14">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : category
              ? `${category} Services`
              : "All Services"}
        </h1>

        {services.length === 0 ? (
          <p className="text-center text-gray-400">
            No services available in your area.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-[#0f172a] border border-gray-700 rounded-2xl overflow-hidden
                group transition-all duration-300 hover:-translate-y-2
                hover:border-orange-500 hover:shadow-[0_15px_35px_rgba(249,115,22,0.35)]"
              >

                {/* IMAGE */}
                <div className="relative h-44 bg-gray-800 flex items-center justify-center text-gray-400">
                  {service.images?.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "No Image"
                  )}

                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                    ₹{service.price}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col justify-between h-[200px]">
                  <div>

                    <h3 className="text-lg font-semibold group-hover:text-orange-400 transition">
                      {service.name}
                    </h3>

                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                      {service.description}
                    </p>

                    {/* 🔥 FIXED LOCATION RENDER */}
                    <p className="text-xs text-gray-400 mt-3">
                      📍 {service.location?.area || "N/A"}, {service.location?.city || ""}
                    </p>

                    <p className="text-xs text-gray-500">
                      {service.location?.pincode || ""}
                    </p>

                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      {service.provider?.name || "Unknown"}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/services/${service._id}`)
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg transition"
                    >
                      View
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* LOCATION MODAL */}
      {showLocationModal && (
        <LocationModal close={() => setShowLocationModal(false)} />
      )}
    </section>
  );
};

export default Services;
