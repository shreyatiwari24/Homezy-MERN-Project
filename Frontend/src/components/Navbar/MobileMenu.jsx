import { useEffect } from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({ open, close = () => {} }) => {

  // close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [close]);

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300
      ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
      />

      {/* Menu */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-white shadow-xl p-6
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="flex flex-col gap-4 text-gray-700 font-medium">

          <Link to="/" onClick={close} className="py-2 hover:text-orange-500">
            Home
          </Link>

          <Link to="/services" onClick={close} className="py-2 hover:text-orange-500">
            Services
          </Link>

          <Link to="/about" onClick={close} className="py-2 hover:text-orange-500">
            About Us
          </Link>

          <Link to="/contact" onClick={close} className="py-2 hover:text-orange-500">
            Contact
          </Link>

        </nav>
      </div>

    </div>
  );
};

export default MobileMenu;
