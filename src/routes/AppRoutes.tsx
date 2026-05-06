import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Landing from "../pages/landing_page/Landing";
import Login from "../pages/login_page/Login";
import Dashboard from "../pages/dashboard_page/Dashboard";
import Occupants from "../pages/occupants_page/Occupants";
import Houses from "../pages/houses_page/Houses";
import Payments from "../pages/payments_page/Payments";
import Expenses from "../pages/expenses_page/Expenses";
import MyDues from "../pages/occupant_payments_page/MyDues";

// Guard: redirect to /login if no token
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!Cookies.get("token");
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Guard: RT Only
function RtRoute({ children }: { children: React.ReactNode }) {
  const isRt = Cookies.get("user_is_rt") === "true";
  return isRt ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

// Guard: Occupant Only
function OccupantRoute({ children }: { children: React.ReactNode }) {
  const isRt = Cookies.get("user_is_rt") === "true";
  return !isRt ? <>{children}</> : <Navigate to="/dashboard" replace />;
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
        
        {/* All Role */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* RT Only */}
        <Route path="/occupants" element={<RtRoute><Occupants /></RtRoute>} />
        <Route path="/payments" element={<RtRoute><Payments /></RtRoute>} />
        <Route path="/expenses" element={<RtRoute><Expenses /></RtRoute>} />
        <Route path="/houses" element={<RtRoute><Houses /></RtRoute>} />

        {/* Occupant Only */}
        <Route path="/my-dues" element={<OccupantRoute><MyDues /></OccupantRoute>} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

