
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Attendee Components
import Dashboard from './components/Dashboard';
import ConferenceRegistration from './components/ConferenceRegistration';
import Schedules from './components/Schedules';
import Certificates from './components/Certificates';
import Overview from './components/Overview';

// Auth & Admin Components

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
//>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
//<<<<<<< HEAD

//=======
import Navbar from './components/Navbar';
//>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <div className="min-h-screen font-sans text-text-primary bg-bg-secondary"><<<<<<< HEAD
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Attendee Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="registration" element={<ConferenceRegistration />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="certificates" element={<Certificates />} />
            </Route>
          </Route>


        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>


          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );

        </Routes>
      </div>
    </Router>
  )

}

export default App;
