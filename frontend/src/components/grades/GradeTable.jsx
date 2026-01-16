import ResponsiveTable from "../ui/ResponsiveTable";
import RowActions from "../ui/RowActions";

const GradeTable = ({
  grades = [],
  search = "",
  DarkMode,
  onEdit,
  onDelete,
  allowWrite = true,
}) => {
  const filtered = grades.filter((g) =>
    `${g.student_name || ""} ${g.course_name || ""} ${g.grade || ""} ${
      g.score || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ResponsiveTable
      title="Grades"
      subtitle="Manage student grades"
      DarkMode={DarkMode}
      columns={[
        { key: "student_name", label: "Student" },
        { key: "course_name", label: "Course" },
        { key: "grade", label: "Grade" },
        { key: "score", label: "Score" },
      ]}
      data={filtered}
      renderMobileCard={(g) => (
        <div className="space-y-1">
          <p className="font-bold">{g.student_name}</p>
          <p className="text-sm opacity-80">{g.course_name}</p>
          <p className="text-sm">
            <b>Grade:</b> {g.grade}
          </p>
          <p className="text-sm">
            <b>Score:</b> {g.score}
          </p>
        </div>
      )}
      renderActions={(g) => (
        <RowActions
          disabled={!allowWrite}
          onEdit={() => onEdit(g)}
          onDelete={() => onDelete(g)}
        />
      )}
    />
  );
};

export default GradeTable;
