import { useState, useEffect } from "react";
import CustomerSidebar from "../components/Sidebar/CustomerSidebar";

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 80;

const CustomerLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">

      {/* Overlay (Mobile) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <CustomerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: collapsed ? 80 : 260,
        }}
      >
        <div className="px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;