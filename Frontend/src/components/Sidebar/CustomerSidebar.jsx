import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaBars,
  FaSignOutAlt,
  FaStar,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import SidebarItem from "./SidebarItem";

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 80;

const CustomerSidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {

  // ✅ Hooks must be inside component
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/customer/dashboard", icon: <FaHome /> },
    { name: "Bookings", path: "/customer/bookings", icon: <FaClipboardList /> },
    { name: "Saved", path: "/customer/saved-providers", icon: <FaHeart /> },
    { name: "Reviews", path: "/customer/reviews", icon: <FaStar /> },
    { name: "Profile", path: "/customer/profile", icon: <FaUser /> },
    {name:"Go to Home", path:"/",icon:<FaArrowLeft/>}
  ];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 
      flex flex-col justify-between
      transition-all duration-300 ease-in-out
      shadow-2xl
      ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      style={{
        width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
        background: "linear-gradient(180deg, #0f172a, #1e3a8a)",
      }}
    >
      <div>
        {/* Logo & Toggle */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            {!collapsed && (
              <span className="text-white font-semibold text-base truncate">
                {user?.name || "User"}
              </span>
            )}
          </div>

          <FaBars className="text-white" />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <SidebarItem key={item.name} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      {/*   
     // logout button at the bottom */}
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3 text-white hover:bg-red-600 rounded-lg transition"
        >
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default CustomerSidebar;

