import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import ResponsiveTable from "../components/ui/ResponsiveTable";
import { useTheme } from "../context/ThemeContext";
import DashboardCharts from "../components/dashboard/DashboardCharts";


import {
  Users,
  UserCog,
  BookOpen,
  Layers,
  ClipboardCheck,
  GraduationCap,
  Trophy,
} from "lucide-react";

const Dashboard = () => {
  const { dark } = useTheme();

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [
        studentsRes,
        teachersRes,
        coursesRes,
        enrollmentsRes,
        attendanceRes,
        gradesRes,
        resultsRes,
      ] = await Promise.all([
        api.get("students/"),
        api.get("teachers/"),
        api.get("courses/"),
        api.get("enrollments/"),
        api.get("attendance/"),
        api.get("grades/"),
        api.get("results/"),
      ]);

      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
      setAttendance(attendanceRes.data);
      setGrades(gradesRes.data);
      setResults(resultsRes.data);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const recentEnrollments = [...enrollments]
    .sort((a, b) =>
      (b.enrollment_date || "").localeCompare(a.enrollment_date || "")
    )
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Overview of your Student Management System
            </p>
          </div>

          <button
            onClick={fetchAll}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-10 text-center opacity-70 text-slate-700 dark:text-slate-300">
            Loading dashboard...
          </div>
        )}

        {/* CONTENT */}
        {!loading && (
          <>
            {/* STATS GRID 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Total Students"
                value={students.length}
                icon={<Users size={22} />}
                DarkMode={dark}
              />
              <StatsCard
                title="Total Teachers"
                value={teachers.length}
                icon={<UserCog size={22} />}
                DarkMode={dark}
              />
              <StatsCard
                title="Total Courses"
                value={courses.length}
                icon={<BookOpen size={22} />}
                DarkMode={dark}
              />
              <StatsCard
                title="Total Enrollments"
                value={enrollments.length}
                icon={<Layers size={22} />}
                DarkMode={dark}
              />
            </div>

            {/* STATS GRID 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Attendance Records"
                value={attendance.length}
                icon={<ClipboardCheck size={22} />}
                DarkMode={dark}
              />
              <StatsCard
                title="Grades"
                value={grades.length}
                icon={<GraduationCap size={22} />}
                DarkMode={dark}
              />
              <StatsCard
                title="Results"
                value={results.length}
                icon={<Trophy size={22} />}
                DarkMode={dark}
              />
            </div>

            {/* TABLE */}
            <ResponsiveTable
              title="Recent Enrollments"
              subtitle="Last 5 student enrollments"
              DarkMode={dark}
              columns={[
                { key: "student", label: "Student" },
                { key: "course", label: "Course" },
                { key: "status", label: "Status" },
                { key: "enrollment_date", label: "Date" },
              ]}
              data={recentEnrollments}
            />
            <DashboardCharts
              studentsCount={students.length}
              teachersCount={teachers.length}
              coursesCount={courses.length}
              enrollmentsCount={enrollments.length}
              attendanceCount={attendance.length}
              gradesCount={grades.length}
              resultsCount={results.length}
            />

          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
