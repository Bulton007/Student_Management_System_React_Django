import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import CourseTable from "../components/courses/CourseTable";
import CourseModal from "../components/courses/CourseModal";
import DeleteConfirm from "../components/common/DeleteConfirm";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // ✅ reactive theme
  const { dark } = useTheme();

  // ✅ role permission
  const role = localStorage.getItem("role") || "student";
  const allowWrite = ["admin", "staff"].includes(user?.role);

  // ✅ FETCH COURSES
  const fetchCourses = async () => {
    try {
      const res = await api.get("courses/");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses:", err);
      toast.error("Failed to load courses ❌");
    }
  };

  useEffect(() => {
    fetchCourses();
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

  const handleEdit = (c) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(c);
    setShowModal(true);
  };

  const handleDelete = (c) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(c);
    setShowDelete(true);
  };

  const handleSave = async (data) => {
    try {
      if (selected) {
        await api.put(`courses/${selected.id}/`, data);
        toast.success("Course updated ✅");
      } else {
        await api.post("courses/", data);
        toast.success("Course created ✅");
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      toast.error("Failed to save course ❌");
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`courses/${selected.id}/`);
      toast.success("Course deleted ✅");

      setShowDelete(false);
      fetchCourses();
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
          Courses
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
          + Add Course
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
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {/* TABLE */}
      <CourseTable
        courses={courses}
        search={search}
        DarkMode={dark}
        allowWrite={allowWrite} // ✅ important
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <CourseModal
          course={selected}
          DarkMode={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE */}
      {showDelete && (
        <DeleteConfirm
          title="Delete Course"
          message="This action cannot be undone."
          DarkMode={dark}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Courses;
