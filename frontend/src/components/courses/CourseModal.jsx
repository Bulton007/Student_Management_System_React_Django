import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  code: "",
  name: "",
  credits: "",
  semester: "",
  teacher: "",
};

const CourseModal = ({ course, onClose, onSave, DarkMode }) => {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load teachers
  useEffect(() => {
    api
      .get("teachers/")
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Failed to load teachers:", err));
  }, []);

  // ✅ Populate when editing / reset when adding
  useEffect(() => {
    if (course) {
      setForm({
        code: course.code ?? "",
        name: course.name ?? "",
        credits: course.credits ?? "",
        semester: course.semester ?? "",
        teacher: course.teacher ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [course]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError("");

    // ✅ basic validation
    if (
      !String(form.code).trim() ||
      !String(form.name).trim() ||
      !String(form.credits).trim() ||
      !String(form.semester).trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        code: form.code.trim(),
        name: form.name.trim(),
        credits: Number(form.credits), // ✅ convert to number
        semester: form.semester.trim(),
        teacher: form.teacher ? Number(form.teacher) : null, // ✅ id or null
      });

      onClose();
    } catch (err) {
      console.error(err?.response?.data);

      if (err?.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else {
        setError("Failed to save course.");
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
          {course ? "Edit Course" : "Add Course"}
        </h2>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <input
          className={inputStyle}
          placeholder="Course code"
          value={form.code}
          onChange={(e) => handleChange("code", e.target.value)}
        />

        <input
          className={inputStyle}
          placeholder="Course name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          type="number"
          className={inputStyle}
          placeholder="Credits"
          value={form.credits}
          onChange={(e) => handleChange("credits", e.target.value)}
        />

        <input
          className={inputStyle}
          placeholder="Semester (e.g. Semester 1)"
          value={form.semester}
          onChange={(e) => handleChange("semester", e.target.value)}
        />

        <select
          className={inputStyle}
          value={form.teacher || ""}
          onChange={(e) => handleChange("teacher", e.target.value)}
        >
          <option value="">Select teacher (optional)</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.full_name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-4">
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

export default CourseModal;
