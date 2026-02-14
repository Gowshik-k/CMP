import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import Navbar from './components/Navbar';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <div className="min-h-screen font-sans text-text-primary bg-bg-secondary pt-16">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Attendee', 'Author', 'Reviewer', 'Chair']} />}>
            <Route path="/dashboard" element={<UserDashboard user={user} setUser={setUser} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
