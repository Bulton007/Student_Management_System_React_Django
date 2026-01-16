import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import EnrollmentTable from "../components/enrollments/EnrollmentTable";
import EnrollmentModal from "../components/enrollments/EnrollmentModal";
import DeleteConfirm from "../components/common/DeleteConfirm";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { user, loading } = useAuth();

  // ✅ reactive theme
  const { dark } = useTheme();

  // ✅ roles
  const role = localStorage.getItem("role") || "student";
  const allowWrite = ["admin", "staff"].includes(user?.role);

  // ✅ FETCH ENROLLMENTS
  const fetchEnrollments = async () => {
    try {
      const res = await api.get("enrollments/");
      setEnrollments(res.data);
    } catch (err) {
      console.error("Failed to load enrollments:", err);
      toast.error("Failed to load enrollments ❌");
    }
  };

  useEffect(() => {
    fetchEnrollments();
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

  const handleEdit = (e) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(e);
    setShowModal(true);
  };

  const handleDelete = (e) => {
    if (!allowWrite) {
      toast.error("You don't have permission ❌");
      return;
    }
    setSelected(e);
    setShowDelete(true);
  };

  const handleSave = async (data) => {
    try {
      if (selected) {
        await api.put(`enrollments/${selected.id}/`, data);
        toast.success("Enrollment updated ✅");
      } else {
        await api.post("enrollments/", data);
        toast.success("Enrollment created ✅");
      }

      setShowModal(false);
      fetchEnrollments();
    } catch (err) {
      toast.error("Failed to save enrollment ❌");
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`enrollments/${selected.id}/`);
      toast.success("Enrollment deleted ✅");

      setShowDelete(false);
      fetchEnrollments();
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
          Enrollments
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
          + Add Enrollment
        </button>
      </div>

      {/* TABLE */}
      <EnrollmentTable
        enrollments={enrollments}
        DarkMode={dark}
        allowWrite={allowWrite} // ✅ important
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <EnrollmentModal
          enrollment={selected}
          DarkMode={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE */}
      {showDelete && (
        <DeleteConfirm
          title="Delete Enrollment"
          message="This action cannot be undone."
          DarkMode={dark}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Enrollments;
