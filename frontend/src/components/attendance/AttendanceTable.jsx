import ResponsiveTable from "../ui/ResponsiveTable";
import RowActions from "../ui/RowActions";

const AttendanceTable = ({
  records = [],
  search = "",
  DarkMode,
  onEdit,
  onDelete,
  allowWrite = true,
}) => {
  const filtered = records.filter((r) =>
    `${r.student_name || ""} ${r.course_name || ""} ${r.status || ""} ${
      r.date || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ResponsiveTable
      title="Attendance"
      subtitle="Track student attendance"
      DarkMode={DarkMode}
      columns={[
        { key: "student_name", label: "Student" },
        { key: "course_name", label: "Course" },
        { key: "date", label: "Date" },
        { key: "status", label: "Status" },
      ]}
      data={filtered}
      renderMobileCard={(r) => (
        <div className="space-y-1">
          <p className="font-bold">{r.student_name}</p>
          <p className="text-sm opacity-80">{r.course_name}</p>
          <p className="text-sm">
            <b>Date:</b> {r.date}
          </p>
          <p className="text-sm">
            <b>Status:</b> {r.status}
          </p>
        </div>
      )}
      renderActions={(r) => (
        <RowActions
          disabled={!allowWrite} // ✅ disable buttons only
          onEdit={() => onEdit(r)}
          onDelete={() => onDelete(r)}
        />
      )}
    />
  );
};

export default AttendanceTable;
