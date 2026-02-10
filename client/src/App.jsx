import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import Dashboard from './components/Dashboard';
import ConferenceRegistration from './components/ConferenceRegistration';
import Schedules from './components/Schedules';
import Certificates from './components/Certificates';
import Overview from './components/Overview';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-text-primary bg-bg-secondary">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Attendee Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="registration" element={<ConferenceRegistration />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="certificates" element={<Certificates />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
