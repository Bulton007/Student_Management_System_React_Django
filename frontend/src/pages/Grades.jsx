import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import GradeTable from "../components/grades/GradeTable";
import GradeModal from "../components/grades/GradeModal";
import DeleteConfirm from "../components/common/DeleteConfirm";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { user, loading } = useAuth();

  // ✅ reactive theme
  const { dark } = useTheme();

  // ✅ role check
  const role = user?.role;
  const allowWrite = ["admin", "staff", "teacher"].includes(role);

  // ✅ FETCH GRADES
  const fetchGrades = async () => {
    try {
      const res = await api.get("grades/");
      setGrades(res.data);
    } catch (err) {
      console.error("Failed to load grades:", err);
      toast.error("Failed to load grades ❌");
    }
  };

  useEffect(() => {
    fetchGrades();
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

  const handleEdit = (g) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(g);
    setShowModal(true);
  };

  const handleDelete = (g) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(g);
    setShowDelete(true);
  };

  const handleSave = async (data) => {
    try {
      if (selected) {
        await api.put(`grades/${selected.id}/`, data);
        toast.success("Grade updated ✅");
      } else {
        await api.post("grades/", data);
        toast.success("Grade created ✅");
      }

      setShowModal(false);
      fetchGrades();
    } catch (err) {
      toast.error("Failed to save grade ❌");
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`grades/${selected.id}/`);
      toast.success("Grade deleted ✅");

      setShowDelete(false);
      fetchGrades();
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
          Grades
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
          + Add Grade
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
          placeholder="Search grades..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {/* TABLE */}
      <GradeTable
        grades={grades}
        search={search}
        DarkMode={dark}
        allowWrite={allowWrite}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <GradeModal
          grade={selected}
          DarkMode={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE CONFIRM */}
      {showDelete && (
        <DeleteConfirm
          title="Delete Grade"
          message="This action cannot be undone."
          DarkMode={dark}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Grades;
