import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api/axios";
import LocationModal from "../../../../components/location/LocationModal";

const STATIC_CATEGORIES = [
  "Plumbing", "Electrician", "Cleaning", "Carpentry",
  "Painting", "AC Repair", "Appliance Repair", "Other"
];

const ProviderCreateService = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    city: "",
    area: "",
    address: "",
    pincode: "",
  });

  const [locationData, setLocationData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── Load categories from API, fall back to static ── */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/services/categories");
        if (Array.isArray(data) && data.length > 0) setCategories(data);
        else setCategories(STATIC_CATEGORIES.map(n => ({ _id: n, name: n })));
      } catch {
        setCategories(STATIC_CATEGORIES.map(n => ({ _id: n, name: n })));
      }
    };
    fetchCategories();
  }, []);

  /* ── Restore location from localStorage on mount ── */
  useEffect(() => {
    restoreLocation();
  }, []);

  const restoreLocation = () => {
    try {
      const loc = JSON.parse(localStorage.getItem("location"));
      if (!loc) return;

      let lng, lat;
      if (Array.isArray(loc.coordinates) && loc.coordinates.length === 2) {
        [lng, lat] = loc.coordinates;
      } else if (loc.lng != null && loc.lat != null) {
        lng = loc.lng; lat = loc.lat;
      } else return;

      setLocationData({ ...loc, lng, lat });
      setForm(prev => ({
        ...prev,
        city:    loc.city    || prev.city,
        area:    loc.area    || prev.area,
        pincode: loc.pincode || prev.pincode,
        address: prev.address || `${loc.area || ""}, ${loc.city || ""}`,
      }));
    } catch { /* ignore */ }
  };

  /* ── Location confirmed from modal ── */
  const handleLocationConfirmed = (data) => {
    setLocationData(data);
    setForm(prev => ({
      ...prev,
      city:    data.city    || prev.city,
      area:    data.area    || prev.area,
      pincode: data.pincode || prev.pincode,
      address: prev.address || `${data.area}, ${data.city}`,
    }));
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.category)             return setError("Please select a service category");
    if (!form.name.trim())          return setError("Service name is required");
    if (!form.price || form.price <= 0) return setError("Please enter a valid price");
    if (!form.pincode)              return setError("Pincode is required");
    if (!locationData)              return setError("Please set your service location");
    if (!locationData.lat || !locationData.lng) return setError("Invalid location — please reselect");

    try {
      setLoading(true);

      await API.post("/services", {
        name:        form.name.trim(),
        description: form.description.trim(),
        price:       Number(form.price),
        category:    form.category,
        city:        form.city,
        area:        form.area,
        address:     form.address,
        pincode:     form.pincode,
        lat:         locationData.lat,
        lng:         locationData.lng,
      });

      setSuccess(true);
      setTimeout(() => navigate("/provider/services"), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (success) return (
    <div className="min-h-screen bg-[#080C18] flex items-center justify-center px-6">
      <div className="text-center animate-[scaleIn_0.4s_ease]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl shadow-orange-500/30">✓</div>
        <h2 className="text-2xl font-black text-[#EDF2FF] mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Service Submitted!</h2>
        <p className="text-[#7A8FBA] text-sm">Your service is under review. Redirecting…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080C18] px-4 py-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/provider/services")}
            className="flex items-center gap-2 text-sm text-[#7A8FBA] hover:text-[#EDF2FF] transition-colors mb-6"
          >
            ← Back to Services
          </button>
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-orange-500 to-blue-500" />
            <h1 className="text-3xl font-black text-[#EDF2FF] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              Create Service
            </h1>
          </div>
          <p className="text-sm text-[#3D4E70] mt-2 pl-5">Fill in the details below. Your service will go live after admin approval.</p>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold px-4 py-3 rounded-xl mb-6">
            <span className="text-base">⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Service Details Card ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6">
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-orange-500 via-blue-500 to-transparent" />

            <p className="text-[10px] font-extrabold text-orange-500 tracking-[2px] uppercase mb-5">Service Details</p>

            <div className="space-y-4">

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#7A8FBA] uppercase tracking-wider">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-[#0D1224] border border-[#1F2D50] text-[#EDF2FF] px-4 py-3 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer appearance-none"
                  required
                >
                  <option value="">Select a category…</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id} className="bg-[#0D1224]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#7A8FBA] uppercase tracking-wider">Service Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Full Home Deep Cleaning"
                  className="w-full bg-[#0D1224] border border-[#1F2D50] text-[#EDF2FF] placeholder-[#3D4E70] px-4 py-3 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#7A8FBA] uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe what's included in this service, tools used, time required…"
                  className="w-full bg-[#0D1224] border border-[#1F2D50] text-[#EDF2FF] placeholder-[#3D4E70] px-4 py-3 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                  required
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#7A8FBA] uppercase tracking-wider">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FBA] font-bold text-sm">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full bg-[#0D1224] border border-[#1F2D50] text-[#EDF2FF] placeholder-[#3D4E70] pl-8 pr-4 py-3 rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    required
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ── Location Card ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#121830] to-[#0D1224] border border-[#1F2D50] rounded-2xl p-6">
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-blue-500 via-orange-500 to-transparent" />

            {/* Location header */}
            <div className="flex justify-between items-center mb-5">
              <p className="text-[10px] font-extrabold text-blue-400 tracking-[2px] uppercase">Service Location</p>
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors border border-orange-500/30 px-3 py-1.5 rounded-lg hover:bg-orange-500/10"
              >
                {locationData ? "Change" : "Set Location"}
              </button>
            </div>

            {/* Location status */}
            {!locationData ? (
              <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2.5 mb-4">
                <span>⚠</span> Location required — click "Set Location" above
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2.5 mb-4">
                <span>✓</span> {locationData.area}, {locationData.city} — {locationData.pincode}
              </div>
            )}

            {/* Location fields */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "city",    placeholder: "City",         col: "" },
                { name: "pincode", placeholder: "Pincode",      col: "" },
                { name: "area",    placeholder: "Area/Locality", col: "col-span-2" },
                { name: "address", placeholder: "Full Address",  col: "col-span-2" },
              ].map(f => (
                <input
                  key={f.name}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className={`bg-[#0D1224] border border-[#1F2D50] text-[#EDF2FF] placeholder-[#3D4E70] px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${f.col}`}
                />
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-extrabold text-base text-white bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </span>
            ) : "Submit for Approval →"}
          </button>

          <p className="text-center text-xs text-[#3D4E70]">
            Your service will be reviewed by our team before going live.
          </p>

        </form>
      </div>

      {/* ── Location Modal ── */}
      {showLocationModal && (
        <LocationModal
          close={() => setShowLocationModal(false)}
          onConfirm={handleLocationConfirmed}
        />
      )}

    </div>
  );
};

export default ProviderCreateService;