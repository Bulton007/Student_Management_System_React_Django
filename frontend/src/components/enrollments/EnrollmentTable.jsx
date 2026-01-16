import ResponsiveTable from "../ui/ResponsiveTable";
import RowActions from "../ui/RowActions";

const EnrollmentTable = ({
  enrollments = [],
  search = "",
  DarkMode,
  onEdit,
  onDelete,
  allowWrite = true,
}) => {
  const filtered = enrollments.filter((e) =>
    `${e.student_name || ""} ${e.course_name || ""} ${e.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ResponsiveTable
      title="Enrollments"
      subtitle="Manage student enrollments"
      DarkMode={DarkMode}
      columns={[
        { key: "student_name", label: "Student" },
        { key: "course_name", label: "Course" },
        { key: "status", label: "Status" },
        { key: "enrollment_date", label: "Date" },
      ]}
      data={filtered}
      renderMobileCard={(e) => (
        <div className="space-y-1">
          <p className="font-bold">{e.student_name}</p>
          <p className="text-sm opacity-80">{e.course_name}</p>
          <p className="text-sm">
            <b>Status:</b> {e.status}
          </p>
          <p className="text-sm">
            <b>Date:</b> {e.enrollment_date}
          </p>
        </div>
      )}
      renderActions={(e) => (
        <RowActions
          disabled={!allowWrite} // ✅ disable only buttons
          onEdit={() => onEdit(e)}
          onDelete={() => onDelete(e)}
        />
      )}
    />
  );
};

export default EnrollmentTable;
