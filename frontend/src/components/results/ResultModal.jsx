import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  enrollment: "",
  final_score: "",
  gpa: "",
  status: "Pass",
};

const ResultModal = ({ result, onClose, onSave, DarkMode }) => {
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
    if (result) {
      setForm({
        enrollment: result.enrollment ?? "",
        final_score: result.final_score ?? "",
        gpa: result.gpa ?? "",
        status: result.status ?? "Pass",
      });
    } else {
      setForm(emptyForm);
    }
  }, [result]);

  const handleSave = async () => {
    setError("");

    if (!form.enrollment || form.final_score === "" || form.gpa === "") {
      setError("Enrollment, score and GPA are required.");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        enrollment: Number(form.enrollment),      // ✅ id as number
        final_score: Number(form.final_score),    // ✅ number
        gpa: Number(form.gpa),                    // ✅ number
        status: form.status,
      });

      onClose();
    } catch (err) {
      console.error(err?.response?.data);

      if (err?.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else {
        setError("Failed to save result.");
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
          {result ? "Edit Result" : "Add Result"}
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

        <input
          type="number"
          className={inputStyle}
          placeholder="Final Score (0-100)"
          value={form.final_score}
          onChange={(e) => setForm({ ...form, final_score: e.target.value })}
        />

        <input
          type="number"
          className={inputStyle}
          placeholder="GPA (0-4)"
          value={form.gpa}
          onChange={(e) => setForm({ ...form, gpa: e.target.value })}
        />

        <select
          className={inputStyle}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Pass">Pass</option>
          <option value="Fail">Fail</option>
        </select>

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

export default ResultModal;
