import { useEffect, useState } from "react";
import API from "../../../api/axios";
import toast from "react-hot-toast";

/* ── helpers ── */
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const memberDuration = (iso) => {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} member`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) !== 1 ? "s" : ""} member`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) !== 1 ? "s" : ""} member`;
};

/* ── reusables ── */
const FieldLabel = ({ children }) => (
  <span className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
    {children}
  </span>
);

const SectionCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-7 ${className}`}>
    {children}
  </div>
);

const ProviderProfile = () => {

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH PROFILE
  =============================== */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/provider/profile");
      // Handle both response formats
      const profileData = res.data.profile || res.data;
      setProfile(profileData);
    } catch (err) {
      console.error("Profile fetch error:", err.response?.status, err.response?.data);
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     INPUT CHANGE
  =============================== */
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  /* ===============================
     UPDATE PROFILE
  =============================== */
  const updateProfile = async () => {
    try {
      const res = await API.put("/provider/profile", profile);
      const updatedProfile = res.data.profile || res.data;
      setProfile(updatedProfile);
      toast.success("Profile Updated successfully!");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 font-medium">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-400 to-blue-500" />
        
        <div className="relative flex items-center gap-6 mt-2">
          {/* Avatar */}
          <div className="w-20 h-20 shrink-0 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md"
               style={{ background: "linear-gradient(135deg, #F97316, #3B82F6)" }}>
            {profile.user?.name?.charAt(0)?.toUpperCase() || "P"}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 truncate mb-2">{profile.user?.name || "Provider Profile"}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
                🛠 Provider
              </span>
              {profile.user?.createdAt && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
                  🗓 Member since {formatDate(profile.user.createdAt)}
                </span>
              )}
              {profile.user?.createdAt && (
                <span className="text-xs text-gray-400 font-medium">· {memberDuration(profile.user.createdAt)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PROFESSIONAL INFO ── */}
      <SectionCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-800">Professional Information</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs font-bold text-orange-500 bg-orange-50 hover:bg-orange-100 border border-transparent hover:border-orange-200 px-4 py-2 rounded-xl transition-colors"
            >
              ✏ Edit
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Input
            label="Phone"
            name="phone"
            value={profile.phone}
            editing={editing}
            onChange={handleChange}
          />
          <Input
            label="Email"
            value={profile.user?.email}
            editing={false} // Email not editable here
          />
          <Input
            label="Category"
            name="category"
            value={profile.category}
            editing={editing}
            onChange={handleChange}
          />
          <Input
            label="Experience"
            name="experience"
            value={profile.experience}
            editing={editing}
            onChange={handleChange}
          />
          <Input
            label="Service Rate (₹/hr)"
            name="rate"
            value={profile.rate}
            editing={editing}
            onChange={handleChange}
            type="number"
          />
          <Input
            label="City"
            name="city"
            value={profile.city}
            editing={editing}
            onChange={handleChange}
          />
          <Input
            label="Area"
            name="area"
            value={profile.area}
            editing={editing}
            onChange={handleChange}
          />
           <Input
            label="Pincode"
            name="pincode"
            value={profile.pincode}
            editing={editing}
            onChange={handleChange}
          />
        </div>

        {/* BIO */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <FieldLabel>Bio / About Me</FieldLabel>
          {editing ? (
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all resize-none"
              placeholder="Tell customers about your expertise..."
            />
          ) : (
            <p className="text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100 leading-relaxed">
              {profile.bio || "No bio added yet."}
            </p>
          )}
        </div>

        {/* ADDRESS */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <FieldLabel>Full Address</FieldLabel>
          {editing ? (
            <textarea
              name="address"
              value={profile.address || ""}
              onChange={handleChange}
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all resize-none"
              placeholder="Detailed address..."
            />
          ) : (
            <p className="text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100 leading-relaxed">
              {profile.address || "No address added yet."}
            </p>
          )}
        </div>

        {/* SAVE BUTTONS */}
        {editing && (
          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={updateProfile}
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Save Changes
            </button>
            <button
              onClick={() => { setEditing(false); fetchProfile(); }}
              className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

/* ===============================
   INPUT COMPONENT
================================ */
const Input = ({ label, value, name, editing, onChange, type = "text" }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {editing && name ? (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
      />
    ) : (
      <p className="text-sm font-bold text-gray-800 bg-gray-50/50 px-4 py-2.5 rounded-xl border border-gray-100">
        {value || "—"}
      </p>
    )}
  </div>
);

export default ProviderProfile;