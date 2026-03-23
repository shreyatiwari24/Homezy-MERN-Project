import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LocationModal from "../../../components/location/LocationModal";

const categories = [
  "Plumbing",
  "Electrician",
  "Cleaning",
  "Carpentry",
  "Painting",
  "AC Repair",
  "Appliance Repair",
  "Other"
];

const ProviderRegister = () => {

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [locationData, setLocationData] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    experience: "",
    rate: "",
    bio: "",
    address: "",
    pincode: "",
    password: "",
    confirmPassword: "",
    agree: false
  });

  /* ================= LOAD LOCATION ================= */

const loadLocation = () => {
  try {
    const loc = localStorage.getItem("location");
    if (!loc) return;

    const parsed = JSON.parse(loc);

    let lng, lat;

    // ✅ support both formats
    if (parsed.coordinates?.length === 2) {
      [lng, lat] = parsed.coordinates;
    } else if (parsed.lng && parsed.lat) {
      lng = parsed.lng;
      lat = parsed.lat;
    } else {
      return;
    }

    setLocationData({
      ...parsed,
      lng,
      lat
    });

    setForm((prev) => ({
      ...prev,
      pincode: parsed.pincode || "",
      address: `${parsed.area || ""}, ${parsed.city || ""}`
    }));

  } catch (err) {
    console.error("Invalid location", err);
  }
};

  useEffect(() => {
    loadLocation();
  }, []);

  // 🔥 refresh after modal closes
  useEffect(() => {
    if (!showLocationModal) {
      loadLocation();
    }
  }, [showLocationModal]);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    if (!form.name.trim()) return "Full name required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Invalid email";
    if (!/^[0-9]{10}$/.test(form.phone))
      return "Invalid phone";
    if (!form.category) return "Select category";
    if (!form.address.trim()) return "Address required";
    if (!/^[0-9]{6}$/.test(form.pincode)) return "Invalid pincode";
    if (form.password.length < 6) return "Weak password";
    if (form.password !== form.confirmPassword)
      return "Passwords mismatch";
    if (!form.agree) return "Accept terms";

    if (!locationData) return "Please select your location";

    return null;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const error = validateForm();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "provider",

        phone: form.phone.trim(),
        category: form.category,
        experience: Number(form.experience),
        rate: Number(form.rate),
        bio: form.bio.trim(),

        city: locationData.city,
        area: locationData.area,
        address: form.address,
        pincode: form.pincode,

        coordinates: [
          locationData.lng,
          locationData.lat
        ]
      });

      toast.success("Application submitted successfully");
      navigate("/provider/login");

    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e3a8a]">

      <div className="w-full max-w-5xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow p-10 text-white">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
            Become a Service Provider
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            Join and grow your business
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BASIC */}
          <Section title="Basic Info">
            <Grid>
              <Input name="name" placeholder="Full Name" onChange={handleChange}/>
              <Input name="email" placeholder="Email" onChange={handleChange}/>
              <Input name="phone" placeholder="Phone" onChange={handleChange}/>

              <select name="category" onChange={handleChange} className="glassInput">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </Grid>
          </Section>

          {/* PROFESSIONAL */}
          <Section title="Professional">
            <Grid>
              <Input name="experience" placeholder="Experience (years)" onChange={handleChange}/>
              <Input name="rate" placeholder="Hourly Rate ₹" onChange={handleChange}/>
            </Grid>

            <textarea
              name="bio"
              placeholder="Describe your services..."
              className="glassInput mt-4"
              rows={3}
              onChange={handleChange}
            />
          </Section>

          {/* LOCATION */}
          <Section title="Location">

            {/* 🔥 LOCATION HEADER */}
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-300">
                📍 {locationData
                  ? `${locationData.area}, ${locationData.city} - ${locationData.pincode}`
                  : "No location selected"}
              </p>

              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="text-blue-400 text-sm hover:underline"
              >
                {locationData ? "Change" : "Set Location"}
              </button>
            </div>

            <Grid>
              <Input name="address" placeholder="Full Address" value={form.address} onChange={handleChange}/>
              <Input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange}/>
            </Grid>

          </Section>

          {/* SECURITY */}
          <Section title="Security">
            <Grid>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="glassInput pr-10"
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <Input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange}/>
            </Grid>
          </Section>

          {/* TERMS */}
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <input type="checkbox" name="agree" onChange={handleChange}/>
            Accept Terms & Conditions
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-blue-500"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

        </form>
      </div>

      {/* 🔥 LOCATION MODAL */}
      {showLocationModal && (
        <LocationModal close={() => setShowLocationModal(false)} />
      )}

    </div>
  );
};

/* ================= UI HELPERS ================= */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-orange-400 font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 gap-5">{children}</div>
);

const Input = ({ ...props }) => (
  <input className="glassInput" {...props} />
);

export default ProviderRegister;

