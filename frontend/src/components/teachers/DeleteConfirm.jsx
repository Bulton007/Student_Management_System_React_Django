const DeleteConfirm = ({ title, message, onCancel, onConfirm, DarkMode }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`w-96 rounded-xl p-6 shadow-xl
          ${DarkMode ? "bg-slate-900 text-white" : "bg-white"}
        `}
      >
        <h2 className="text-lg font-bold mb-2">
          {title || "Confirm Delete"}
        </h2>

        <p className="text-sm opacity-80 mb-4">
          {message || "Are you sure you want to delete this item?"}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
