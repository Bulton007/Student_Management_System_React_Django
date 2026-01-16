import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.old_password || !form.new_password || !form.confirm_password) {
      toast.error("All fields are required ❌");
      return;
    }

    if (form.new_password.length < 6) {
      toast.error("New password must be at least 6 characters ❌");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      setLoading(true);

      await api.post("auth/change-password/", {
        old_password: form.old_password,
        new_password: form.new_password,
      });

      toast.success("Password changed successfully ✅");
      setForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.log(err?.response?.data);

      if (err?.response?.data) {
        const msg = Object.values(err.response.data).flat().join(" ");
        toast.error(msg);
      } else {
        toast.error("Failed to change password ❌");
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
            <Lock size={18} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Change Password
            </h1>
            <p className="text-sm text-slate-500 dark:text-white/60">
              Update your password securely.
            </p>
          </div>
        </div>

        {/* ✅ Card */}
        <div
          className="
            rounded-2xl border shadow-sm p-6
            bg-white border-gray-200
            dark:bg-white/5 dark:border-white/10
            backdrop-blur
          "
        >
          {/* Old Password */}
          <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-1">
            Old Password
          </label>
          <input
            type="password"
            value={form.old_password}
            onChange={(e) => handleChange("old_password", e.target.value)}
            placeholder="Enter old password"
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

          {/* New Password */}
          <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={form.new_password}
            onChange={(e) => handleChange("new_password", e.target.value)}
            placeholder="Enter new password"
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

          {/* Confirm Password */}
          <label className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={form.confirm_password}
            onChange={(e) => handleChange("confirm_password", e.target.value)}
            placeholder="Confirm password"
            className="
              w-full mb-6 px-4 py-2.5 rounded-xl border outline-none transition
              bg-white text-slate-900 border-gray-300
              placeholder:text-slate-400
              focus:ring-2 focus:ring-blue-500

              dark:bg-white/10 dark:text-white dark:border-white/10
              dark:placeholder:text-white/40
              dark:focus:ring-blue-400
            "
          />

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
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
              {loading ? "Saving..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
