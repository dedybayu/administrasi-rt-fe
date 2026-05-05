import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!Cookies.get('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
