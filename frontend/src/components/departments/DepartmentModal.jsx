import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  description: "",
};

const DepartmentModal = ({ department, onClose, onSave, DarkMode }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Populate when editing / reset when adding
  useEffect(() => {
    if (department) {
      setForm({
        name: department.name ?? "",
        description: department.description ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [department]);

  const handleSave = async () => {
    setError("");

    if (!String(form.name).trim()) {
      setError("Department name is required.");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        name: form.name.trim(),
        description: form.description?.trim() || "",
      });

      onClose();
    } catch (err) {
      console.error(err?.response?.data);

      if (err?.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else {
        setError("Failed to save department.");
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
          {department ? "Edit Department" : "Add Department"}
        </h2>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <input
          className={inputStyle}
          placeholder="Department name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <textarea
          className={inputStyle}
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-3">
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

export default DepartmentModal;
