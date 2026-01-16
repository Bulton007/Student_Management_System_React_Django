import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Enrollments from "./pages/Enrollments";
import Departments from "./pages/Departments";
import Grades from "./pages/Grades";
import Attendance from "./pages/Attendance";
import Results from "./pages/Results";

import CreateUser from "./pages/CreateUser";
import ChangePassword from "./pages/ChangePassword";

import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

// ✅ Admin Only Route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const { user, loading } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (loading) return null; // or a loader

  return user?.role === "admin" ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/students"
          element={
            <PrivateRoute>
              <Students />
            </PrivateRoute>
          }
        />

        <Route
          path="/teachers"
          element={
            <PrivateRoute>
              <Teachers />
            </PrivateRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <Courses />
            </PrivateRoute>
          }
        />

        <Route
          path="/enrollments"
          element={
            <PrivateRoute>
              <Enrollments />
            </PrivateRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <PrivateRoute>
              <Departments />
            </PrivateRoute>
          }
        />

        <Route
          path="/grades"
          element={
            <PrivateRoute>
              <Grades />
            </PrivateRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />

        <Route
          path="/results"
          element={
            <PrivateRoute>
              <Results />
            </PrivateRoute>
          }
        />

        {/* ✅ ALL USERS */}
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />

        {/* ✅ ADMIN ONLY */}
        <Route
          path="/create-user"
          element={
            <AdminRoute>
              <CreateUser />
            </AdminRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
