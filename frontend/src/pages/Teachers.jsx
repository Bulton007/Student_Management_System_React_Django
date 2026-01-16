import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import TeacherTable from "../components/teachers/TeacherTable";
import TeacherModal from "../components/teachers/TeacherModal";
import DeleteConfirm from "../components/teachers/DeleteConfirm";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { user, loading } = useAuth();

  // ✅ reactive theme
  const { dark } = useTheme();

  const role = user?.role;
  const allowWrite = ["admin", "staff"].includes(role);

  // ✅ FETCH TEACHERS
  const fetchTeachers = async () => {
    try {
      const res = await api.get("teachers/");
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to load teachers:", err);
      toast.error("Failed to load teachers ❌");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // ✅ HANDLERS
  const handleAdd = () => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelectedTeacher(null);
    setShowModal(true);
  };

  const handleEdit = (teacher) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelectedTeacher(teacher);
    setShowModal(true);
  };

  const handleDelete = (teacher) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelectedTeacher(teacher);
    setShowDelete(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedTeacher) {
        await api.put(`teachers/${selectedTeacher.id}/`, data);
        toast.success("Teacher updated ✅");
      } else {
        await api.post("teachers/", data);
        toast.success("Teacher created ✅");
      }
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      toast.error("Failed to save teacher ❌");
      throw err; // let modal show error
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`teachers/${selectedTeacher.id}/`);
      toast.success("Teacher deleted ✅");

      setShowDelete(false);
      fetchTeachers();
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
          Teachers
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
          + Add Teacher
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
          placeholder="Search teachers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none flex-1"
        />
      </div>

      {/* TABLE */}
      <TeacherTable
        teachers={teachers}
        search={search}
        DarkMode={dark}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <TeacherModal
          teacher={selectedTeacher}
          DarkMode={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE CONFIRM */}
      {showDelete && (
        <DeleteConfirm
          title="Delete Teacher"
          message="This action cannot be undone."
          DarkMode={dark}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Teachers;
