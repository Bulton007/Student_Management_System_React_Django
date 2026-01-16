import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  Layers,
  Building2,
  GraduationCap,
  ClipboardCheck,
  Trophy,
  Shield,
  KeyRound,
  X,
} from "lucide-react";

const Sidebar = ({ collapsed, openSidebar, setOpenSidebar, dark }) => {
  const { user } = useAuth();

  // ✅ take role from DB
  const role = user?.role || "student";

  const allMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      roles: ["admin", "staff", "teacher", "student"],
    },
    {
      name: "Students",
      path: "/students",
      icon: <Users size={18} />,
      roles: ["admin", "staff"],
    },
    {
      name: "Teachers",
      path: "/teachers",
      icon: <UserCog size={18} />,
      roles: ["admin", "staff"],
    },
    {
      name: "Courses",
      path: "/courses",
      icon: <BookOpen size={18} />,
      roles: ["admin", "staff", "teacher", "student"],
    },
    {
      name: "Enrollments",
      path: "/enrollments",
      icon: <Layers size={18} />,
      roles: ["admin", "staff"],
    },
    {
      name: "Departments",
      path: "/departments",
      icon: <Building2 size={18} />,
      roles: ["admin", "staff"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: <ClipboardCheck size={18} />,
      roles: ["admin", "staff", "teacher"],
    },
    {
      name: "Grades",
      path: "/grades",
      icon: <GraduationCap size={18} />,
      roles: ["admin", "staff", "teacher"],
    },
    {
      name: "Results",
      path: "/results",
      icon: <Trophy size={18} />,
      roles: ["admin", "staff", "teacher", "student"],
    },

    // ✅ ALL USERS
    {
      name: "Change Password",
      path: "/change-password",
      icon: <KeyRound size={18} />,
      roles: ["admin", "staff", "teacher", "student"],
    },

    // ✅ ADMIN ONLY
    {
      name: "Create User",
      path: "/create-user",
      icon: <Shield size={18} />,
      roles: ["admin"],
    },
  ];

  const menu = allMenu.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-40 transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
        ${openSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        border-r
        ${dark ? "bg-[#07122a] border-white/10 text-white" : "bg-white border-gray-200 text-slate-900"}
      `}
    >
      {/* LOGO */}
      <div
        className={`h-16 flex items-center justify-between px-4 border-b ${
          dark ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
            S
          </div>

          {!collapsed && (
            <div className="leading-tight">
              <h1 className={`font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                SMS Admin
              </h1>
              <p className={`text-xs ${dark ? "text-white/60" : "text-slate-500"}`}>
                Role: {role}
              </p>
            </div>
          )}
        </div>

        {/* mobile close */}
        <button
          onClick={() => setOpenSidebar(false)}
          className={`md:hidden p-2 rounded-lg transition ${
            dark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-slate-700"
          }`}
        >
          <X size={18} />
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-3 space-y-1 px-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setOpenSidebar(false)}
            className={({ isActive }) => `
              flex items-center gap-3 p-2 rounded-xl transition
              ${collapsed ? "justify-center" : ""}
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : dark
                    ? "text-white/80 hover:bg-white/10"
                    : "text-slate-700 hover:bg-gray-100"
              }
            `}
          >
            <span>{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
