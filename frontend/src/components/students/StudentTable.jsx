import ResponsiveTable from "../ui/ResponsiveTable";
import RowActions from "../ui/RowActions";

const StudentTable = ({
  students = [],
  search = "",
  DarkMode,
  onEdit,
  onDelete,
  allowWrite = true, // ✅ add this
}) => {
  const filtered = students.filter((s) =>
    `${s.first_name} ${s.last_name} ${s.email} ${s.phone} ${s.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ResponsiveTable
      title="Students"
      subtitle="Manage student records"
      DarkMode={DarkMode}
      columns={[
        { key: "first_name", label: "First Name" },
        { key: "last_name", label: "Last Name" },
        { key: "gender", label: "Gender" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status" },
      ]}
      data={filtered}
      renderMobileCard={(s) => (
        <div className="space-y-1">
          <p className="font-bold text-base">
            {s.first_name} {s.last_name}
          </p>
          <p className="text-sm opacity-80">{s.email}</p>
          <p className="text-sm opacity-80">{s.phone}</p>
          <p className="text-sm">
            <b>Status:</b> {s.status}
          </p>
        </div>
      )}
      renderActions={(s) => (
        <RowActions
          disabled={!allowWrite} // ✅ disable buttons
          onEdit={() => onEdit(s)}
          onDelete={() => onDelete(s)}
        />
      )}
    />
  );
};

export default StudentTable;
