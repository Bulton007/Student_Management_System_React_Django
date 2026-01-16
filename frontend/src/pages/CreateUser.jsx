import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const CreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "student",
    is_approved: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    if (!form.username || !form.password || !form.role) {
      toast.error("Username, password and role are required ❌");
      return;
    }

    try {
      setLoading(true);
      await api.post("auth/create-user/", form);
      toast.success("User created successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      console.log(err?.response?.data);

      if (err?.response?.data) {
        const msg = Object.values(err.response.data).flat().join(" ");
        toast.error(msg);
      } else {
        toast.error("Failed to create user ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
            <UserPlus size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Create User
            </h1>
            <p className="text-sm text-slate-500 dark:text-white/60">
              Admin can create new accounts for staff / teachers / students.
            </p>
          </div>
        </div>

        {/* ✅ Card (same style as your tables/cards) */}
        <div
          className="
            rounded-2xl border shadow-sm p-6
            bg-white border-gray-200
            dark:bg-white/5 dark:border-white/10
            backdrop-blur
          "
        >
          {/* Username */}
          <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-1">
            Username
          </label>
          <input
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Enter username"
            className="
              w-full mb-4 px-4 py-2.5 rounded-xl border outline-none transition
              bg-white text-slate-900 border-gray-300
              placeholder:text-slate-400
              focus:ring-2 focus:ring-blue-500

              dark:bg-white/10 dark:text-white dark:border-white/10
              dark:placeholder:text-white/40
              dark:focus:ring-blue-400
            "
          />

          {/* Password */}
          <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-1">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Enter password"
            className="
              w-full mb-4 px-4 py-2.5 rounded-xl border outline-none transition
              bg-white text-slate-900 border-gray-300
              placeholder:text-slate-400
              focus:ring-2 focus:ring-blue-500

              dark:bg-white/10 dark:text-white dark:border-white/10
              dark:placeholder:text-white/40
              dark:focus:ring-blue-400
            "
          />

          {/* Role */}
          <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-1">
            Role
          </label>
          <select
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="
              w-full mb-4 px-4 py-2.5 rounded-xl border outline-none transition
              bg-white text-slate-900 border-gray-300
              focus:ring-2 focus:ring-blue-500

              dark:bg-white/10 dark:text-white dark:border-white/10
              dark:focus:ring-blue-400
              dark:[color-scheme:dark]
            "
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          {/* Approved */}
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-white/80 mb-6">
            <input
              type="checkbox"
              checked={form.is_approved}
              onChange={(e) => handleChange("is_approved", e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            Approve immediately (user can login)
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(-1)}
              className="
                px-4 py-2 rounded-xl border text-sm font-semibold transition
                bg-white text-slate-700 border-gray-300 hover:bg-gray-100
                dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/15
              "
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              disabled={loading}
              className={`
                px-5 py-2 rounded-xl text-sm font-semibold text-white transition
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;
