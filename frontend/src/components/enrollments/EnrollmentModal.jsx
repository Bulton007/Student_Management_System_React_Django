import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  student: "",
  course: "",
  status: "Enrolled",
};

const EnrollmentModal = ({ enrollment, onClose, onSave, DarkMode }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load students & courses
  useEffect(() => {
    api
      .get("students/")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Failed to load students:", err));

    api
      .get("courses/")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  // ✅ Populate on edit / reset on add
  useEffect(() => {
    if (enrollment) {
      setForm({
        student: enrollment.student ?? "",
        course: enrollment.course ?? "",
        status: enrollment.status ?? "Enrolled",
      });
    } else {
      setForm(emptyForm);
    }
  }, [enrollment]);

  const handleSave = async () => {
    setError("");

    if (!form.student || !form.course) {
      setError("Student and course are required.");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        student: Number(form.student), // ✅ ensure ID is number
        course: Number(form.course),   // ✅ ensure ID is number
        status: form.status,
      });

      onClose();
    } catch (err) {
      console.error(err?.response?.data);

      // ✅ show backend message if exists
      if (err?.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else if (err?.response?.status === 400) {
        setError("This student is already enrolled in this course.");
      } else {
        setError("Failed to save enrollment.");
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
          {enrollment ? "Edit Enrollment" : "Add Enrollment"}
        </h2>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        {/* Student */}
        <select
          className={inputStyle}
          value={form.student}
          onChange={(e) => setForm({ ...form, student: e.target.value })}
        >
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.first_name} {s.last_name}
            </option>
          ))}
        </select>

        {/* Course */}
        <select
          className={inputStyle}
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        >
          <option value="">Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code ? `${c.code} - ${c.name}` : c.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          className={inputStyle}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Enrolled">Enrolled</option>
          <option value="Completed">Completed</option>
          <option value="Dropped">Dropped</option>
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

export default EnrollmentModal;
