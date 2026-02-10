import React from 'react';

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

export default Overview;
