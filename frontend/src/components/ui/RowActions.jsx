const RowActions = ({ onEdit, onDelete, disabled = false }) => {
  return (
    <div className="flex justify-end gap-3">
      <button
        disabled={disabled}
        onClick={onEdit}
        className={`text-blue-600 font-medium text-sm transition
          ${
            disabled
              ? "opacity-40 cursor-not-allowed"
              : "hover:underline"
          }
        `}
      >
        Edit
      </button>

      <button
        disabled={disabled}
        onClick={onDelete}
        className={`text-red-600 font-medium text-sm transition
          ${
            disabled
              ? "opacity-40 cursor-not-allowed"
              : "hover:underline"
          }
        `}
      >
        Delete
      </button>
    </div>
  );
};

export default RowActions;
