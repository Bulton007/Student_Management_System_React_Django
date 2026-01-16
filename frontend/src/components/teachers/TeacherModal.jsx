import { useEffect, useState } from "react";

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  department: "",
};

const TeacherModal = ({ teacher, onClose, onSave, DarkMode }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Populate form when editing / reset when adding
  useEffect(() => {
    if (teacher) {
      setForm({
        full_name: teacher.full_name ?? "",
        email: teacher.email ?? "",
        phone: teacher.phone ?? "",
        department: teacher.department ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [teacher]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError("");

    // ✅ validation (trim)
    for (const key in form) {
      if (!String(form[key]).trim()) {
        setError("All fields are required.");
        return;
      }
    }

    try {
      setLoading(true);
      await onSave(form);
      onClose();
    } catch (err) {
      console.error(err?.response?.data);

      if (err?.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else {
        setError("Failed to save teacher.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `w-full mb-3 p-2 rounded border outline-none
    ${
      DarkMode
        ? "bg-slate-800 border-slate-700 text-white"
        : "bg-white border-gray-300"
    }
  `;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`w-[420px] rounded-xl p-6 shadow-xl
          ${DarkMode ? "bg-slate-900 text-white" : "bg-white"}
        `}
      >
        <h2 className="text-lg font-bold mb-4">
          {teacher ? "Edit Teacher" : "Add Teacher"}
        </h2>

        {error && <div className="mb-3 text-sm text-red-500">{error}</div>}

        <input
          className={inputStyle}
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
        />

        <input
          type="email"
          className={inputStyle}
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <input
          className={inputStyle}
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <input
          className={inputStyle}
          placeholder="Department"
          value={form.department}
          onChange={(e) => handleChange("department", e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          {/* ✅ Cancel always clickable */}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-1 text-sm rounded text-white
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherModal;
