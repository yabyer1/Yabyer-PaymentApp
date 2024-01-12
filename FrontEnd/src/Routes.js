import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RegisterPage from './components/RegisterPage';

const Transform = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect from root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Routes for login, dashboard, and register */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default Transform;
