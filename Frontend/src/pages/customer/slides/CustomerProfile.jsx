import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { LocationContext } from "../../../context/LocationContext";
import API from "../../../api/axios";
import LocationPopup from "../../../components/location/LocationModal";

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

const calcStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
};

const strengthMeta = [
  { label: "",       barColor: "bg-slate-200",  textColor: "text-slate-400"  },
  { label: "Weak",   barColor: "bg-red-400",    textColor: "text-red-500"    },
  { label: "Fair",   barColor: "bg-amber-400",  textColor: "text-amber-500"  },
  { label: "Good",   barColor: "bg-blue-400",   textColor: "text-blue-500"   },
  { label: "Strong", barColor: "bg-green-500",  textColor: "text-green-600"  },
];

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

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const CustomerProfile = () => {
  const { user, updateUser, changePassword: changePasswordAPI } = useContext(AuthContext);
  const { location } = useContext(LocationContext);

  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [editing, setEditing] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [profileLoading,  setProfileLoading]  = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [toast,     setToast]     = useState(null);
  const [pwStrength, setPwStrength] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name  || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

const updateProfile = async () => {
  if (!name.trim()) {
    showToast("Name cannot be empty", "error");
    return;
  }

  try {
    setProfileLoading(true);

    const payload = {
      name: name.trim(),
      email: email, // ✅ include email (important)
    };

    console.log("Sending payload:", payload);

    const res = await API.put("/users/profile", payload);

    console.log("Response:", res.data);

    // ✅ handle both response formats safely
    const updatedUser = res.data.user || res.data;

    updateUser(updatedUser);
    setName(updatedUser.name || "");
    setEmail(updatedUser.email || "");

    setEditing(false);
    showToast("Profile updated successfully");

  } catch (err) {
    console.error("ERROR:", err);
    console.log("SERVER:", err.response?.data);

    showToast(
      err.response?.data?.message || "Profile update failed",
      "error"
    );
  } finally {
    setProfileLoading(false);
  }
};

// ONLY showing UPDATED parts (keep rest same)




/* ================= CHANGE PASSWORD (🔥 FIXED) ================= */

const changePassword = async () => {
  const { currentPassword, newPassword } = passwords;

  // ✅ validation
  if (!currentPassword || !newPassword) {
    showToast("Please fill both password fields", "error");
    return;
  }

  if (newPassword.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }

  if (currentPassword === newPassword) {
    showToast("New password must be different", "error");
    return;
  }

  try {
    setPasswordLoading(true);

    // ✅ correct payload
    await changePasswordAPI({
      oldPassword: currentPassword,
      newPassword,
    });

    showToast("Password changed successfully");

    // reset
    setPasswords({ currentPassword: "", newPassword: "" });
    setPwStrength(0);

  } catch (err) {
    console.error("PASSWORD ERROR:", err);

    showToast(
      err.response?.data?.message ||
      err.message ||
      "Password update failed",
      "error"
    );
  } finally {
    setPasswordLoading(false);
  }
};

  const sm = strengthMeta[pwStrength];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border
          ${toast.type === "error"
            ? "bg-red-50 text-red-600 border-red-200"
            : "bg-green-50 text-green-700 border-green-200"}`}
        >
          <span className="font-bold">{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-400 to-blue-500" />
        
        <div className="relative flex items-center gap-6 mt-2">
          {/* Avatar */}
          <div className="w-20 h-20 shrink-0 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md"
               style={{ background: "linear-gradient(135deg, #F97316, #3B82F6)" }}>
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 truncate mb-2">{user?.name || "My Profile"}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
                👤 Customer
              </span>
              {user?.createdAt && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
                  🗓 Member since {formatDate(user.createdAt)}
                </span>
              )}
              {user?.createdAt && (
                <span className="text-xs text-gray-400 font-medium">· {memberDuration(user.createdAt)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PERSONAL INFO ── */}
      <SectionCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-800">Personal Information</h2>
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

          {/* Full name */}
          <div>
            <FieldLabel>Full Name</FieldLabel>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
              />
            ) : (
              <p className="text-sm font-bold text-gray-800 bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100">{user?.name || "—"}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <FieldLabel>Email Address</FieldLabel>
            <p className="text-sm font-medium text-gray-600 bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100">{email || "—"}</p>
          </div>

          {/* Address */}
          <div>
            <FieldLabel>Delivery Address</FieldLabel>
            <div className="bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100 min-h-[42px] flex items-center">
              {location ? (
                <p className="text-sm font-bold text-gray-800">
                  {[location.area, location.city, location.pincode && `- ${location.pincode}`]
                    .filter(Boolean).join(", ")}
                </p>
              ) : (
                <p className="text-sm text-gray-400 font-medium">No address selected</p>
              )}
            </div>
            <button
              onClick={() => setShowLocationPopup(true)}
              className="mt-2 text-[10px] font-bold uppercase tracking-wider text-orange-500 hover:text-orange-600"
            >
              📍 Change Address
            </button>
          </div>

          {/* Member Since */}
          <div>
            <FieldLabel>Member Since</FieldLabel>
            <div className="bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100">
              <p className="text-sm font-bold text-gray-800">{formatDate(user?.createdAt)}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{memberDuration(user?.createdAt)}</p>
            </div>
          </div>

        </div>

        {editing && (
          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={updateProfile}
              disabled={profileLoading}
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
              {profileLoading ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => { setEditing(false); setName(user?.name || ""); }}
              className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </SectionCard>

      {/* ── SECURITY ── */}
      <SectionCard>
        <h2 className="text-base font-bold text-gray-800 mb-6">Security Settings</h2>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">

          {/* Current password */}
          <div>
            <FieldLabel>Current Password</FieldLabel>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
            />
          </div>

          {/* New password + strength */}
          <div>
            <FieldLabel>New Password</FieldLabel>
            <input
              type="password"
              placeholder="Enter new password"
              value={passwords.newPassword}
              onChange={(e) => {
                const v = e.target.value;
                setPasswords({ ...passwords, newPassword: v });
                setPwStrength(v ? calcStrength(v) : 0);
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
            />
            {passwords.newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength ? sm.barColor : "bg-slate-200"}`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-semibold ${sm.textColor}`}>{sm.label}</p>
              </div>
            )}
          </div>

        </div>

        <button
          onClick={changePassword}
          disabled={passwordLoading}
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
        >
          {passwordLoading ? "Updating…" : "🔒 Update Password"}
        </button>
      </SectionCard>

      {/* ── ACCOUNT OVERVIEW ── */}
      <SectionCard>
        <h2 className="text-base font-bold text-gray-800 mb-5">Account Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "👤", label: "Account Type", value: "Customer"                    },
            { icon: "🗓", label: "Member Since",  value: formatDate(user?.createdAt)   },
            { icon: "⏱", label: "Duration",      value: memberDuration(user?.createdAt) || "—" },
            { icon: "✅", label: "Status",        value: "Active"                      },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="text-xl mb-2">{icon}</div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
              <p className="text-sm font-bold text-gray-800 leading-snug">{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* LOCATION POPUP */}
      {showLocationPopup && <LocationPopup close={() => setShowLocationPopup(false)} />}
    </div>
  );
};

export default CustomerProfile;