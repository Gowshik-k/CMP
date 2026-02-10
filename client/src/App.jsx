import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import ConferenceRegistration from './components/ConferenceRegistration';
import Schedules from './components/Schedules';
import Certificates from './components/Certificates';

const Home = () => (
  <div className="app">
    {/* Hero Section */}
    <section className="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="container hero-content">
        <div className="hero-text fade-in-up">
          <h1 className="hero-title">
            University Conference
            <span className="gradient-text"> Management System</span>
          </h1>
          <p className="hero-subtitle">
            Streamline your academic conference planning with our comprehensive platform.
            From paper submissions to event scheduling, we've got you covered.
          </p>
          <div className="hero-buttons">
            <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>

        <div className="hero-image float">
          <div className="conference-illustration">
            <div className="illustration-card card-1">
              <div className="icon">📄</div>
              <div className="label">Paper Submission</div>
            </div>
            <div className="illustration-card card-2">
              <div className="icon">👥</div>
              <div className="label">Attendee Management</div>
            </div>
            <div className="illustration-card card-3">
              <div className="icon">📅</div>
              <div className="label">Event Scheduling</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="features">
      <div className="container">
        <h2 className="section-title">
          Powerful Features for <span className="gradient-text">Academic Excellence</span>
        </h2>

        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Scheduling</h3>
            <p>AI-powered scheduling that optimizes sessions, venues, and speaker availability.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Real-time insights into submissions, registrations, and attendee engagement.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Enterprise-grade security ensuring your data and submissions are protected.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">🌐</div>
            <h3>Global Reach</h3>
            <p>Multi-language support and timezone management for international conferences.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">💬</div>
            <h3>Collaboration Tools</h3>
            <p>Built-in communication features for organizers, reviewers, and participants.</p>
          </div>

          <div className="feature-card card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Ready</h3>
            <p>Fully responsive design that works seamlessly on all devices.</p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Transform Your Conference Experience?</h2>
          <p>Join hundreds of universities already using our platform</p>
          <button className="btn btn-primary">Start Your Free Trial</button>
        </div>
      </div>
    </section>
  </div>
);

const Overview = () => (
  <div className="dashboard-overview">
    <h1 className="view-title">Welcome back, John!</h1>
    <p>Here's what's happening with your conferences today.</p>

    <div className="stats-grid">
      <div className="stat-card card">
        <span className="stat-value">3</span>
        <span className="stat-label">Registered Conferences</span>
      </div>
      <div className="stat-card card">
        <span className="stat-value">12</span>
        <span className="stat-label">Upcoming Sessions</span>
      </div>
      <div className="stat-card card">
        <span className="stat-value">5</span>
        <span className="stat-label">Certificates Earned</span>
      </div>
    </div>

    <div className="recent-activity card">
      <h3>Recent Activity</h3>
      <ul className="activity-list">
        <li>
          <span className="activity-dot"></span>
          <span>Registered for "Global AI & Machine Learning Summit 2026"</span>
          <span className="activity-time">2 hours ago</span>
        </li>
        <li>
          <span className="activity-dot"></span>
          <span>Downloaded certificate for "Digital Humanities 2025"</span>
          <span className="activity-time">Yesterday</span>
        </li>
      </ul>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="registration" element={<ConferenceRegistration />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="certificates" element={<Certificates />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
