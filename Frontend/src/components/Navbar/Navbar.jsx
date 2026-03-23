import Logo from "../../assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProfileMenu from "../Dropdown/ProfileMenu";
import { FaSearch, FaBell } from "react-icons/fa";
import CustomerLogin from "../../pages/public/CustomerLogin";
import useNotifications from "../Common/useNotifications";
import NotificationMenu from "../Dropdown/NotificationMenu";


const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const { notifications = [] } = useNotifications(); // ✅ fallback empty array

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/services?search=${encodeURIComponent(search)}`);
    setSearch("");
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 shadow-xl"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #0b1f3a 40%, #1e3a8a 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-10 py-5">

          {/* LOGO */}
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-14 w-auto" />
          </Link>

          {/* NAV LINKS */}
          <ul className="hidden lg:flex items-center gap-12 text-white font-medium">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `transition ${isActive ? "text-orange-400" : "hover:text-orange-400"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-8">

            {/* 🔍 Search */}
            <div className="relative hidden md:flex items-center">
              <FaSearch
                onClick={handleSearch}
                className="absolute left-4 text-gray-400 cursor-pointer hover:text-orange-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Search services..."
                className="pl-12 pr-6 py-2.5 w-72 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* 🔔 Notifications */}
            {user && (
              <div className="relative">

                <div
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-white cursor-pointer"
                >

                  <FaBell className="text-xl hover:text-orange-400 transition" />

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}

                </div>

                {showNotifications && <NotificationMenu />}

              </div>
            )}

            {/* 👤 Profile */}
            {user ? (
              <ProfileMenu />
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-orange-500 px-6 py-2.5 rounded-full text-white font-medium hover:bg-orange-600 transition"
                >
                  Get Started
                </button>

                {showLogin && (
                  <CustomerLogin onClose={() => setShowLogin(false)} />
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;








