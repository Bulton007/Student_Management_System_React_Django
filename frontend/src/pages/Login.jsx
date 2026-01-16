import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Lock, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { dark } = useTheme();
  const { fetchMe } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!form.username || !form.password) {
    toast.error("Username and password are required ❌");
    return;
  }

  try {
    setLoading(true);

    const res = await api.post("auth/login/", {
      username: form.username.trim(),
      password: form.password.trim(),
    });

    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);

    await fetchMe();

    toast.success("Login success ✅");
    navigate("/dashboard");
  } catch (err) {
    console.log("LOGIN ERROR:", err?.response?.data || err.message);

    toast.error(err?.response?.data?.detail || "Invalid username or password ❌");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition ${
        dark
          ? "bg-gradient-to-br from-[#050A18] via-[#050F26] to-[#040812]"
          : "bg-white"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border shadow-xl p-6 sm:p-8 ${
          dark
            ? "bg-[#07122a]/80 border-white/10 text-white backdrop-blur-xl"
            : "bg-white border-gray-200 text-slate-900"
        }`}
      >
        <h1 className="text-2xl font-black mb-2">Welcome Back 👋</h1>
        <p className={`${dark ? "text-white/60" : "text-slate-500"} text-sm mb-6`}>
          Login to Student Management System
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <div
              className={`flex items-center gap-2 mt-1 rounded-xl border px-3 py-2 ${
                dark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
              }`}
            >
              <User size={18} className="opacity-70" />
              <input
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div
              className={`flex items-center gap-2 mt-1 rounded-xl border px-3 py-2 ${
                dark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
              }`}
            >
              <Lock size={18} className="opacity-70" />
              <input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-transparent outline-none flex-1 text-sm"
              />
            </div>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full py-2.5 rounded-xl font-semibold transition text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className={`mt-6 text-center text-xs ${
            dark ? "text-white/50" : "text-slate-500"
          }`}
        >
          © {new Date().getFullYear()} Student Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
