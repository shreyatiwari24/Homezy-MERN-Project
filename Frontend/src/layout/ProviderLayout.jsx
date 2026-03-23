import { useState } from "react";
import ProviderSidebar from "../components/Sidebar/ProviderSidebar";

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 80;

const ProviderLayout = ({ children }) => {

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div>

      <ProviderSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main
        className="transition-all duration-300 min-h-screen bg-gray-100 p-6"
        style={{
          marginLeft: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH
        }}
      >
        {children}
      </main>

    </div>
  );
};

export default ProviderLayout;