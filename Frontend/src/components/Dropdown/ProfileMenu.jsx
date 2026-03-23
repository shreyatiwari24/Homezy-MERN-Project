import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProfileMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const roles = user?.roles || [];
  const isProvider = roles.includes("provider");

  const links = isProvider
    ? [
        { label: "Dashboard", path: "/provider/dashboard" },
        { label: "Services", path: "/provider/services" },
        { label: "Earnings", path: "/provider/earnings" },
        { label: "Profile", path: "/provider/profile" },
      ]
    : [
        { label: "Dashboard", path: "/customer/dashboard" },
        { label: "Bookings", path: "/customer/bookings" },
        { label: "Profile", path: "/customer/profile" },
      ];

  const handleNavigation = (path) => {
    console.log("Navigating to:", path); // debug
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/", { replace: true });
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => {
          console.log("Button clicked");
          setOpen((prev) => !prev);
        }}
        className="w-10 h-10 bg-blue-900 text-white rounded-full 
        flex items-center justify-center font-bold shadow-md 
        hover:scale-105 transition"
      >
        {user?.name?.[0]?.toUpperCase() || "U"}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-60 bg-white rounded-xl 
          shadow-2xl border z-50"
        >
          <div className="px-4 py-3 border-b">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">
              {roles.join(", ")}
            </p>
          </div>

          {links.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className="block w-full text-left px-4 py-3 
              hover:bg-gray-100 transition"
            >
              {item.label}
            </button>
          ))}

          <div className="border-t">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 
              hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;


