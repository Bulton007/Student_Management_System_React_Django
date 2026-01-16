import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import DepartmentTable from "../components/departments/DepartmentTable";
import DepartmentModal from "../components/departments/DepartmentModal";
import DeleteConfirm from "../components/common/DeleteConfirm";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { user, loading } = useAuth();

  // ✅ reactive theme
  const { dark } = useTheme();

  const allowWrite = ["admin", "staff"].includes(user?.role);

  // ✅ FETCH DEPARTMENTS
  const fetchDepartments = async () => {
    try {
      const res = await api.get("departments/");
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to load departments:", err);
      toast.error("Failed to load departments ❌");
    }
  };

  useEffect(() => {
    fetchDepartments();
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

  const handleEdit = (d) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(d);
    setShowModal(true);
  };

  const handleDelete = (d) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(d);
    setShowDelete(true);
  };

  const handleSave = async (data) => {
    try {
      if (selected) {
        await api.put(`departments/${selected.id}/`, data);
        toast.success("Department updated ✅");
      } else {
        await api.post("departments/", data);
        toast.success("Department created ✅");
      }

      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error("Failed to save department ❌");
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`departments/${selected.id}/`);
      toast.success("Department deleted ✅");

      setShowDelete(false);
      fetchDepartments();
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
          Departments
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
          + Add Department
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
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {/* TABLE */}
      <DepartmentTable
        departments={departments}
        search={search}
        DarkMode={dark}
        allowWrite={allowWrite} // ✅ important
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <DepartmentModal
          department={selected}
          DarkMode={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE CONFIRM */}
      {showDelete && (
        <DeleteConfirm
          title="Delete Department"
          message="This action cannot be undone."
          DarkMode={dark}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Departments;
