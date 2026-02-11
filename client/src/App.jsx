import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Attendee Components
import Dashboard from './components/Dashboard';
import ConferenceRegistration from './components/ConferenceRegistration';
import Schedules from './components/Schedules';
import Certificates from './components/Certificates';
import Overview from './components/Overview';

// Auth & Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';

// Wrapper component to handle conditional Navbar rendering
const AppContent = ({ user, setUser }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen font-sans ${!isDashboardRoute ? 'text-text-primary bg-bg-secondary' : 'bg-[#FDFDFD]'}`}>
      {!isDashboardRoute && <Navbar user={user} setUser={setUser} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Attendee Protected Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />}>
            <Route index element={<Overview />} />
            <Route path="registration" element={<ConferenceRegistration />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="certificates" element={<Certificates />} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

export default App;

