import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  enrollment: "",
  date: "",
  status: "Present",
  note: "",
};

const AttendanceModal = ({ record, onClose, onSave, DarkMode }) => {
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
    if (record) {
      setForm({
        enrollment: record.enrollment ?? "",
        date: record.date ?? "",
        status: record.status ?? "Present",
        note: record.note ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [record]);

  const handleSave = async () => {
    setError("");

    if (!form.enrollment || !form.date) {
      setError("Enrollment and date are required.");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        enrollment: Number(form.enrollment), // ✅ convert to number
        date: form.date,
        status: form.status,
        note: form.note?.trim() || "",
      });

      onClose();
    } catch (err) {
      console.error(err?.response?.data);

      if (err?.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else {
        setError("Attendance for this date already exists.");
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
          {record ? "Edit Attendance" : "Add Attendance"}
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
          type="date"
          className={inputStyle}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          className={inputStyle}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Excused">Excused</option>
        </select>

        <textarea
          className={inputStyle}
          placeholder="Note (optional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
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

export default AttendanceModal;
