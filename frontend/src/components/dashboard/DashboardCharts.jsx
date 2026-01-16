import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const DashboardCharts = ({
  studentsCount,
  teachersCount,
  coursesCount,
  enrollmentsCount,
  attendanceCount,
  gradesCount,
  resultsCount,
}) => {
  const { dark } = useTheme();

  const cardStyle = dark
    ? "bg-slate-900 text-white border-slate-700"
    : "bg-white text-slate-900 border-gray-200";

  const statsData = [
    { name: "Students", value: studentsCount },
    { name: "Teachers", value: teachersCount },
    { name: "Courses", value: coursesCount },
    { name: "Enrollments", value: enrollmentsCount },
  ];

  const recordsData = [
    { name: "Attendance", value: attendanceCount },
    { name: "Grades", value: gradesCount },
    { name: "Results", value: resultsCount },
  ];

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      {/* ✅ BAR CHART */}
      <div className={`rounded-2xl border p-5 shadow-sm ${cardStyle} xl:col-span-1`}>
        <h2 className="text-lg font-bold mb-4">System Statistics</h2>

        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statsData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke={dark ? "#cbd5e1" : "#334155"} />
              <YAxis stroke={dark ? "#cbd5e1" : "#334155"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: dark ? "#0f172a" : "#fff",
                  borderRadius: "10px",
                  border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ PIE CHART */}
      <div className={`rounded-2xl border p-5 shadow-sm ${cardStyle} xl:col-span-1`}>
        <h2 className="text-lg font-bold mb-4">Records Distribution</h2>

        <div className="h-[240px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: dark ? "#0f172a" : "#fff",
                  borderRadius: "10px",
                  border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
                }}
              />
              <Pie
                data={recordsData}
                dataKey="value"
                nameKey="name"
                outerRadius={85}
                label
              >
                {recordsData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ THIRD CARD PLACE (optional small chart/info later) */}
      <div className={`rounded-2xl border p-5 shadow-sm ${cardStyle} xl:col-span-1`}>
        <h2 className="text-lg font-bold mb-2">Quick Info</h2>
        <p className="text-sm opacity-70">
          
        </p>
      </div>
    </div>
  );
};

export default DashboardCharts;
