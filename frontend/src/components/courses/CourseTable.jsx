import ResponsiveTable from "../ui/ResponsiveTable";
import RowActions from "../ui/RowActions";

const CourseTable = ({
  courses = [],
  search = "",
  DarkMode,
  onEdit,
  onDelete,
  allowWrite = true,
}) => {
  const filtered = courses.filter((c) =>
    `${c.code} ${c.name} ${c.semester} ${c.credits}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ResponsiveTable
      title="Courses"
      subtitle="Manage course information"
      DarkMode={DarkMode}
      columns={[
        { key: "code", label: "Code" },
        { key: "name", label: "Name" },
        { key: "credits", label: "Credits" },
        { key: "semester", label: "Semester" },
      ]}
      data={filtered}
      renderMobileCard={(c) => (
        <div className="space-y-1">
          <p className="font-bold">
            {c.code} - {c.name}
          </p>
          <p className="text-sm">
            <b>Credits:</b> {c.credits}
          </p>
          <p className="text-sm">
            <b>Semester:</b> {c.semester}
          </p>
        </div>
      )}
      renderActions={(c) => (
        <RowActions
          disabled={!allowWrite} // ✅ disable only buttons
          onEdit={() => onEdit(c)}
          onDelete={() => onDelete(c)}
        />
      )}
    />
  );
};

export default CourseTable;
