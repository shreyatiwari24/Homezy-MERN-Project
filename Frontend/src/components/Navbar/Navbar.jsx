import Logo from "../../assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useContext, useMemo, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProfileMenu from "../Dropdown/ProfileMenu";
import { FaSearch, FaBell } from "react-icons/fa";
import CustomerLogin from "../../pages/public/CustomerLogin";
import useNotifications from "../Common/useNotifications";
import NotificationMenu from "../Dropdown/NotificationMenu";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const notifRef = useRef(null);

  const { notifications } = useNotifications();

  //  FIX: Safe unread count
  const unreadCount = useMemo(() => {
    return Array.isArray(notifications)
      ? notifications.filter((n) => !n.isRead).length
      : 0;
  }, [notifications]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  // 🔍 Search handler
  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/services?search=${encodeURIComponent(search)}`);
    setSearch("");
  };

  //  Close notification on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 shadow-xl"
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #0b1f3a 40%, #1e3a8a 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          {/* LOGO */}
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden lg:flex items-center gap-10 text-white font-medium">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `transition ${
                      isActive ? "text-orange-400" : "hover:text-orange-400"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">

            {/* 🔍 Search */}
            <div className="relative hidden md:flex items-center">
              <FaSearch
                onClick={handleSearch}
                className="absolute left-3 text-gray-400 cursor-pointer hover:text-orange-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search services..."
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/*  Notifications */}
            {user && (
              <div ref={notifRef} className="relative">
                <div
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="relative text-white cursor-pointer transform hover:scale-110 transition"
                >
                  <FaBell className="text-xl hover:text-orange-400" />

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {showNotifications && <NotificationMenu />}
              </div>
            )}

            {/* 👤 Profile / Login */}
            {user ? (
              <ProfileMenu />
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-orange-500 px-5 py-2 rounded-full text-white hover:bg-orange-600 transition"
                >
                  Get Started
                </button>

                {isLoginOpen && (
                  <CustomerLogin onClose={() => setIsLoginOpen(false)} />
                )}
              </>
            )}

            {/* 📱 Mobile Menu Button */}
            <button
              className="lg:hidden text-white text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* 📱 MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden bg-blue-900 text-white flex flex-col items-center gap-6 py-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="hover:text-orange-400"
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;




