import React from 'react';
import { LayoutDashboard, Calendar, FileCheck, LogOut, Settings } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 className="gradient-text">CMP</h2>
          <span className="user-role">Attendee Portal</span>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className={({ isActive }) =>isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/dashboard/registration" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Calendar size={20} />
            <span>Conferences</span>
          </NavLink>
          <NavLink to="/dashboard/schedules" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Calendar size={20} />
            <span>My Schedules</span>
          </NavLink>
          <NavLink to="/dashboard/certificates" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileCheck size={20} />
            <span>Certificates</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="nav-item logout">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
          <div className="header-search">
            <input type="text" placeholder="Search conferences..." className="search-input" />
          </div>
          <div className="user-profile">
            <div className="user-avatar">JD</div>
            <span>John Doe</span>
          </div>
        </header>
        
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
