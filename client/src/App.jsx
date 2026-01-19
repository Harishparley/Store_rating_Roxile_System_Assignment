import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages (We will build the missing ones next)
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard'; // Normal User Store List
import AddStore from './pages/AddStore';
import AdminUsers from './pages/AdminUsers'; // NEW: For Admin to manage users
import OwnerDashboard from './pages/OwnerDashboard'; // NEW: For Store Owner
import ChangePassword from './pages/ChangePassword'; // NEW: For everyone

// Helper to get user role from LocalStorage
const getUserRole = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr).role;
  } catch (e) {
    return null;
  }
};

// Protected Route Component (Checks Token AND Role)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = getUserRole();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect based on their actual role to avoid getting stuck
    if (role === 'admin') return <Navigate to="/admin/users" />;
    if (role === 'owner' || role === 'store_owner') return <Navigate to="/owner/dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* --- NORMAL USER ROUTES --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}> 
              <Dashboard /> 
            </ProtectedRoute>
          } 
        />
        
        {/* --- STORE OWNER ROUTES --- */}
        <Route 
          path="/owner/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['owner', 'store_owner', 'admin']}> 
              <OwnerDashboard /> 
            </ProtectedRoute>
          } 
        />

        {/* --- ADMIN ROUTES --- */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}> 
              <AdminUsers /> 
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-store" 
          element={
            <ProtectedRoute allowedRoles={['admin']}> 
              <AddStore /> 
            </ProtectedRoute>
          } 
        />

        {/* --- SHARED ROUTES --- */}
        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'owner', 'store_owner']}> 
              <ChangePassword /> 
            </ProtectedRoute>
          } 
        />

        {/* Catch all - Redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;