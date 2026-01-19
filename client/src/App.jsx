import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddStore from './pages/AddStore';

import Signup from './pages/Signup'; 

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
        {/* Add this new route */}
        <Route 
          path="/add-store" 
          element={isAuthenticated ? <AddStore /> : <Navigate to="/" />} 
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;