import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceModal from "../components/attendance/AttendanceModal";
import DeleteConfirm from "../components/common/DeleteConfirm";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { user, loading } = useAuth();

  // ✅ reactive theme
  const { dark } = useTheme();

  // ✅ role check
  const role = localStorage.getItem("role") || "student";
  const allowWrite = ["admin", "staff", "teacher"].includes(user?.role);

  // ✅ FETCH ATTENDANCE
  const fetchAttendance = async () => {
    try {
      const res = await api.get("attendance/");
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to load attendance:", err);
      toast.error("Failed to load attendance ❌");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ✅ HANDLERS
  const handleAdd = () => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(null);
    setShowModal(true);
  };

  const handleEdit = (r) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(r);
    setShowModal(true);
  };

  const handleDelete = (r) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(r);
    setShowDelete(true);
  };

  const handleSave = async (data) => {
    try {
      if (selected) {
        await api.put(`attendance/${selected.id}/`, data);
        toast.success("Attendance updated ✅");
      } else {
        await api.post("attendance/", data);
        toast.success("Attendance created ✅");
      }

      setShowModal(false);
      fetchAttendance();
    } catch (err) {
      toast.error("Failed to save attendance ❌");
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`attendance/${selected.id}/`);
      toast.success("Attendance deleted ✅");

      setShowDelete(false);
      fetchAttendance();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed ❌");
    }
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Attendance
        </h1>

        <button
          onClick={handleAdd}
          disabled={!allowWrite}
          className={`px-4 py-2 rounded text-white transition
            ${
              allowWrite
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }
          `}
        >
          + Add Attendance
        </button>
      </div>

      {/* SEARCH */}
      <div
        className={`flex items-center gap-2 mb-4 px-3 py-2 border rounded
          ${
            dark
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-300 text-slate-900"
          }
        `}
      >
        <Search size={18} className="opacity-70" />
        <input
          placeholder="Search attendance..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {/* TABLE */}
      <AttendanceTable
        records={records}
        search={search}
        DarkMode={dark}
        allowWrite={allowWrite} // ✅ important
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <AttendanceModal
          record={selected}
          DarkMode={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE */}
      {showDelete && (
        <DeleteConfirm
          title="Delete Attendance"
          message="This action cannot be undone."
          DarkMode={dark}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Attendance;
