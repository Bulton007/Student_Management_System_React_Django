import ThemeToggle from "./ThemeToggle";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar, openSidebar, dark, setDark }) => {
  const navigate = useNavigate();

  return (
    <header
      className={`sticky top-0 z-20 border-b transition-colors ${
        dark
          ? "bg-[#07122a]/70 border-white/10 backdrop-blur-xl"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 sm:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* ✅ mobile open sidebar */}
          <button
            onClick={openSidebar}
            className={`md:hidden p-2 rounded-lg transition ${
              dark
                ? "text-white hover:bg-white/10"
                : "text-slate-800 hover:bg-gray-100"
            }`}
          >
            <Menu size={20} />
          </button>

          {/* ✅ desktop collapse */}
          <button
            onClick={toggleSidebar}
            className={`hidden md:flex p-2 rounded-lg transition ${
              dark
                ? "text-white hover:bg-white/10"
                : "text-slate-800 hover:bg-gray-100"
            }`}
          >
            <Menu size={20} />
          </button>

          <h1
            className={`font-bold hidden sm:block ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            Student Management System
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <ThemeToggle dark={dark} setDark={setDark} />

          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              navigate("/login");
            }}
            className={`font-medium text-sm transition ${
              dark ? "text-red-300 hover:text-red-400" : "text-red-500 hover:text-red-600"
            }`}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
