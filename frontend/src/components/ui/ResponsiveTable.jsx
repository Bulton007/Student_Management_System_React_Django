import React from "react";

const ResponsiveTable = ({
  title = "",
  subtitle = "",
  DarkMode = false,
  columns = [],
  data = [],
  renderMobileCard,
  renderActions,
}) => {
  const wrapperStyle = DarkMode
    ? "bg-[#0B1633] border-white/10 text-white"
    : "bg-white border-slate-200 text-slate-900";

  const headerBg = DarkMode ? "bg-white/5" : "bg-slate-50";
  const rowHover = DarkMode ? "hover:bg-white/5" : "hover:bg-slate-50";

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${wrapperStyle}`}>
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
          {subtitle && (
            <p className={`text-sm ${DarkMode ? "text-slate-300" : "text-slate-500"}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className={headerBg}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-6 py-3 text-sm font-semibold ${
                    DarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {col.label}
                </th>
              ))}
              {renderActions && (
                <th className="text-right px-6 py-3 text-sm font-semibold">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-10 text-center text-sm opacity-70"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t ${
                    DarkMode ? "border-white/10" : "border-slate-200"
                  } ${rowHover} transition`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm">
                      {row[col.key] ?? "-"}
                    </td>
                  ))}

                  {renderActions && (
                    <td className="px-6 py-4 text-right">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden p-4 space-y-3">
        {data.length === 0 ? (
          <div
            className={`p-6 rounded-xl border text-center text-sm opacity-70 ${
              DarkMode ? "bg-[#0B1633] border-white/10" : "bg-white border-slate-200"
            }`}
          >
            No data found
          </div>
        ) : (
          data.map((row) => (
            <div
              key={row.id}
              className={`p-4 rounded-2xl border ${
                DarkMode ? "bg-[#0B1633] border-white/10" : "bg-white border-slate-200"
              }`}
            >
              {renderMobileCard ? (
                renderMobileCard(row)
              ) : (
                <div className="space-y-1">
                  {columns.slice(0, 3).map((col) => (
                    <p key={col.key} className="text-sm">
                      <span className="font-semibold">{col.label}: </span>
                      {row[col.key] ?? "-"}
                    </p>
                  ))}
                </div>
              )}

              {renderActions && (
                <div className="flex justify-end gap-3 mt-4">
                  {renderActions(row)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponsiveTable;
