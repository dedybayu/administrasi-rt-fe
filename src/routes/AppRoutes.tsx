import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Landing from "../pages/landing_page/Landing";
import Login from "../pages/login_page/Login";
import Dashboard from "../pages/dashboard_page/Dashboard";
import Occupants from "../pages/occupants_page/Occupants";
import Houses from "../pages/houses_page/Houses";

// Guard: redirect to /login if no token
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!Cookies.get("token");
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/occupants" element={<Occupants />} />
        <Route path="/payments" element={<div className="p-8 text-center text-base-content/50">Halaman Iuran & Kas — segera hadir</div>} />
        <Route path="/houses" element={<Houses />} />
        <Route path="/info" element={<div className="p-8 text-center text-base-content/50">Halaman Informasi — segera hadir</div>} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

