import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false); // ✅ mobile drawer
  const { dark, setDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-gradient-to-br from-[#050A18] via-[#050F26] to-[#040812]"
          : "bg-white"
      }`}
    >
      {/* ✅ Sidebar */}
      <Sidebar
        collapsed={collapsed}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        dark={dark}
      />

      {/* ✅ overlay (mobile) */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* ✅ Main */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <Navbar
          toggleSidebar={() => setCollapsed((prev) => !prev)}
          openSidebar={() => setOpenSidebar(true)}
          dark={dark}
          setDark={setDark}
        />

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
