const DeleteConfirm = ({ onCancel, onConfirm, DarkMode }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`w-80 rounded-xl p-6
          ${DarkMode ? "bg-slate-900 text-white" : "bg-white"}
        `}
      >
        <h2 className="font-bold mb-2">Delete Student</h2>
        <p className="text-sm opacity-70 mb-4">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
