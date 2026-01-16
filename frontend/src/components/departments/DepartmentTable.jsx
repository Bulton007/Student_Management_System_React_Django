import ResponsiveTable from "../ui/ResponsiveTable";
import RowActions from "../ui/RowActions";

const DepartmentTable = ({ departments = [], search = "", DarkMode, onEdit, onDelete }) => {
  const filtered = departments.filter((d) =>
    `${d.name || ""} ${d.code || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ResponsiveTable
      title="Departments"
      subtitle="Manage departments"
      DarkMode={DarkMode}
      columns={[
        { key: "code", label: "Code" },
        { key: "name", label: "Department Name" },
      ]}
      data={filtered}
      renderMobileCard={(d) => (
        <div className="space-y-1">
          <p className="font-bold">{d.name}</p>
          <p className="text-sm opacity-80"><b>Code:</b> {d.code}</p>
        </div>
      )}
      renderActions={(d) => (
        <RowActions
          onEdit={() => onEdit(d)}
          onDelete={() => onDelete(d)}
        />
      )}
    />
  );
};

export default DepartmentTable;
