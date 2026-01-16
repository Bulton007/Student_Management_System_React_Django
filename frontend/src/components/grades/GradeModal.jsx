import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  enrollment: "",
  grade: "A",
  score: "",
  remark: "",
};

const GradeModal = ({ grade, onClose, onSave, DarkMode }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load enrollments once
  useEffect(() => {
    api
      .get("enrollments/")
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error("Failed to load enrollments:", err));
  }, []);

  // ✅ Populate when editing / reset when adding
  useEffect(() => {
    if (grade) {
      setForm({
        enrollment: grade.enrollment ?? "",
        grade: grade.grade ?? "A",
        score: grade.score ?? "",
        remark: grade.remark ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [grade]);

  const handleSave = async () => {
    setError("");

    if (!form.enrollment) {
      setError("Enrollment is required.");
      return;
    }

    if (form.score === "" || form.score === null) {
      setError("Score is required.");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        enrollment: Number(form.enrollment), // ✅ id as number
        grade: form.grade,
        score: Number(form.score), // ✅ score as number
        remark: form.remark?.trim() || "",
      });

      onClose();
    } catch (err) {
      console.error(err?.response?.data);

      if (err?.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else {
        setError("Failed to save grade.");
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
          {grade ? "Edit Grade" : "Add Grade"}
        </h2>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <select
          className={inputStyle}
          value={form.enrollment}
          onChange={(e) => setForm({ ...form, enrollment: e.target.value })}
        >
          <option value="">Select enrollment</option>
          {enrollments.map((e) => (
            <option key={e.id} value={e.id}>
              {e.student_name} - {e.course_name}
            </option>
          ))}
        </select>

        <select
          className={inputStyle}
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>

        <input
          className={inputStyle}
          type="number"
          placeholder="Score"
          value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })}
        />

        <textarea
          className={inputStyle}
          placeholder="Remark (optional)"
          value={form.remark}
          onChange={(e) => setForm({ ...form, remark: e.target.value })}
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

export default GradeModal;
