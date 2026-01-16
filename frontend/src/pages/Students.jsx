import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentTable from "../components/students/StudentTable";
import StudentModal from "../components/students/StudentModal";
import DeleteConfirm from "../components/students/DeleteConfirm";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Students = () => {
  const { user, loading } = useAuth();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { dark } = useTheme();

  // ✅ role check
  const role = user?.role;
  const allowWrite = ["admin", "staff",].includes(role);

  // LOAD STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await api.get("students/");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students:", err);
      toast.error("Failed to load students ❌");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // HANDLERS
  const handleAdd = () => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelectedStudent(null);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDelete = (student) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelectedStudent(student);
    setShowDelete(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedStudent) {
        await api.put(`students/${selectedStudent.id}/`, data);
        toast.success("Student updated ✅");
      } else {
        await api.post("students/", data);
        toast.success("Student created ✅");
      }

      setShowModal(false);
      fetchStudents();
    } catch (err) {
      toast.error("Failed to save student ❌");
      throw err; // keep modal error
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`students/${selectedStudent.id}/`);
      toast.success("Student deleted ✅");

      setShowDelete(false);
      fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed ❌");
    }
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Students
        </h1>

        {/* ✅ disabled button (NOT hidden) */}
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
          + Add Student
        </button>
      </div>

      {/* SEARCH */}
      <div
        className={`flex items-center gap-2 px-3 py-2 mb-4 rounded border
          ${
            dark
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-300 text-slate-900"
          }
        `}
      >
        <Search size={18} className="opacity-60" />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none flex-1"
        />
      </div>

      {/* TABLE */}
      <StudentTable
        students={students}
        search={search}
        DarkMode={dark}
        allowWrite={allowWrite} // ✅ NEW
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <StudentModal
          student={selectedStudent}
          DarkMode={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE CONFIRM */}
      {showDelete && (
        <DeleteConfirm
          DarkMode={dark}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Students;
