import { useEffect, useState } from "react";

const emptyForm = {
  first_name: "",
  last_name: "",
  gender: "Male",
  date_of_birth: "",
  email: "",
  phone: "",
  address: "",
  status: "Active",
};

const StudentModal = ({ student, onClose, onSave, DarkMode }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 Populate when editing
  useEffect(() => {
    if (student) {
      setForm({
        first_name: student.first_name ?? "",
        last_name: student.last_name ?? "",
        gender: student.gender ?? "Male",
        date_of_birth: student.date_of_birth ?? "",
        email: student.email ?? "",
        phone: student.phone ?? "",
        address: student.address ?? "",
        status: student.status ?? "Active",
      });
    } else {
      setForm(emptyForm);
    }
  }, [student]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError("");

    // ✅ Validation
    for (const key in form) {
      if (!String(form[key]).trim()) {
        setError("All fields are required.");
        return;
      }
    }

    try {
      setLoading(true);
      await onSave(form); // parent decides close
    } catch (err) {
      console.error(err?.response?.data);

      if (err?.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else {
        setError("Failed to save student.");
      }
    } finally {
      setLoading(false); // ✅ stop Saving...
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
          {student ? "Edit Student" : "Add Student"}
        </h2>

        {error && <div className="mb-3 text-sm text-red-500">{error}</div>}

        <input
          className={inputStyle}
          placeholder="First name"
          value={form.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
        />

        <input
          className={inputStyle}
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
        />

        <select
          className={inputStyle}
          value={form.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="date"
          className={inputStyle}
          value={form.date_of_birth}
          onChange={(e) => handleChange("date_of_birth", e.target.value)}
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

        <textarea
          className={inputStyle}
          placeholder="Address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />

        <select
          className={inputStyle}
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="flex justify-end gap-3 mt-4">
          {/* ✅ Cancel always clickable */}
          <button type="button" onClick={onClose} className="px-3 py-1 text-sm">
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

export default StudentModal;
