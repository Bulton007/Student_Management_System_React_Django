import ResponsiveTable from "../ui/ResponsiveTable";
import RowActions from "../ui/RowActions";

const ResultTable = ({
  results = [],
  search = "",
  DarkMode,
  onEdit,
  onDelete,
  allowWrite = true,
}) => {
  const filtered = results.filter((r) =>
    `${r.student_name || ""} ${r.course_name || ""} ${r.status || ""} ${
      r.final_score || ""
    } ${r.gpa || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ResponsiveTable
      title="Results"
      subtitle="Final exam results"
      DarkMode={DarkMode}
      columns={[
        { key: "student_name", label: "Student" },
        { key: "course_name", label: "Course" },
        { key: "final_score", label: "Final Score" },
        { key: "gpa", label: "GPA" },
        { key: "status", label: "Status" },
      ]}
      data={filtered}
      renderMobileCard={(r) => (
        <div className="space-y-1">
          <p className="font-bold">{r.student_name}</p>
          <p className="text-sm opacity-80">{r.course_name}</p>
          <p className="text-sm">
            <b>Score:</b> {r.final_score}
          </p>
          <p className="text-sm">
            <b>GPA:</b> {r.gpa}
          </p>
          <p className="text-sm">
            <b>Status:</b> {r.status}
          </p>
        </div>
      )}
      renderActions={(r) => (
        <RowActions
          disabled={!allowWrite}
          onEdit={() => onEdit(r)}
          onDelete={() => onDelete(r)}
        />
      )}
    />
  );
};

export default ResultTable;
