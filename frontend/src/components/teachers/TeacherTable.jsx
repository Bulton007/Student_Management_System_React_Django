import ResponsiveTable from "../ui/ResponsiveTable";
import RowActions from "../ui/RowActions";

const TeacherTable = ({
  teachers = [],
  search = "",
  DarkMode,
  onEdit,
  onDelete,
  allowWrite = true,
}) => {
  const filtered = teachers.filter((t) =>
    `${t.full_name} ${t.email} ${t.phone} ${t.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ResponsiveTable
      title="Teachers"
      subtitle="Manage teacher profiles"
      DarkMode={DarkMode}
      columns={[
        { key: "full_name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "department", label: "Department" },
      ]}
      data={filtered}
      renderMobileCard={(t) => (
        <div className="space-y-1">
          <p className="font-bold">{t.full_name}</p>
          <p className="text-sm opacity-80">{t.email}</p>
          <p className="text-sm opacity-80">{t.phone}</p>
          <p className="text-sm">
            <b>Dept:</b> {t.department}
          </p>
        </div>
      )}
      renderActions={(t) => (
        <RowActions
          disabled={!allowWrite}
          onEdit={() => onEdit(t)}
          onDelete={() => onDelete(t)}
        />
      )}
    />
  );
};

export default TeacherTable;
