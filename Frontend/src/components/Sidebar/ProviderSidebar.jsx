import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


import {
  FaHome,
  FaClipboardList,
  FaDollarSign,
  FaChartLine,
  FaUser,
  FaBars,
  FaSignOutAlt,
  FaTools,
  FaArrowLeft
} from "react-icons/fa";

import SidebarItem from "./SidebarItem";

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 80;

const ProviderSidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/provider/dashboard", icon: <FaHome /> },
    { name: "Services", path: "/provider/services", icon: <FaTools /> },
    { name: "Bookings", path: "/provider/bookings", icon: <FaClipboardList /> },
    { name: "Earnings", path: "/provider/earnings", icon: <FaDollarSign /> },
    { name: "Analytics", path: "/provider/analytics", icon: <FaChartLine /> },
    { name: "Profile", path: "/provider/profile", icon: <FaUser /> },
    { name: "Back to Home", path: "/", icon: <FaArrowLeft /> },
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
        background: "linear-gradient(180deg, #0f172a, #1e3a8a)"
      }}
    >
      <div>

        {/* Provider Profile + Toggle */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setCollapsed((prev) => !prev)}
        >

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase() || "P"}
            </div>

            {!collapsed && (
              <span className="text-white font-semibold text-base truncate">
                {user?.name || "Provider"}
              </span>
            )}

          </div>

          <FaBars className="text-white" />

        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 p-4">

          {menuItems.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              collapsed={collapsed}
            />
          ))}

        </nav>

      </div>

      {/* Logout */}
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

export default ProviderSidebar;
