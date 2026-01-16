import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import ResultTable from "../components/results/ResultTable";
import ResultModal from "../components/results/ResultModal";
import DeleteConfirm from "../components/common/DeleteConfirm";
import { Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Results = () => {
  const [results, setResults] = useState([]);
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

  // ✅ FETCH RESULTS
  const fetchResults = async () => {
    try {
      const res = await api.get("results/");
      setResults(res.data);
    } catch (err) {
      console.error("Failed to load results:", err);
      toast.error("Failed to load results ❌");
    }
  };

  useEffect(() => {
    fetchResults();
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
        await api.put(`results/${selected.id}/`, data);
        toast.success("Result updated ✅");
      } else {
        await api.post("results/", data);
        toast.success("Result created ✅");
      }

      setShowModal(false);
      fetchResults();
    } catch (err) {
      toast.error("Failed to save result ❌");
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`results/${selected.id}/`);
      toast.success("Result deleted ✅");

      setShowDelete(false);
      fetchResults();
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
          Results
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
          + Add Result
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
          placeholder="Search results..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {/* TABLE */}
      <ResultTable
        results={results}
        search={search}
        DarkMode={dark}
        allowWrite={allowWrite}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showModal && (
        <ResultModal
          result={selected}
          DarkMode={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE CONFIRM */}
      {showDelete && (
        <DeleteConfirm
          title="Delete Result"
          message="This action cannot be undone."
          DarkMode={dark}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
};

export default Results;
