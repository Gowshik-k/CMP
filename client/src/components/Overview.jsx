import React, { useState, useEffect } from 'react';

const Overview = () => {
    const [stats, setStats] = useState({
        registeredConferences: 0,
        upcomingSessions: 0,
        certificatesEarned: 0
    });

    useEffect(() => {
        fetch('http://localhost:5000/api/attendee/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching stats:', err));
    }, []);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { username: 'Guest' };

    return (
        <div className="dashboard-overview">
            <h1 className="view-title">Welcome back, {user.username}!</h1>
            <p>Here's what's happening with your conferences today.</p>

            <div className="stats-grid">
                <div className="stat-card card">
                    <span className="stat-value">{stats.registeredConferences}</span>
                    <span className="stat-label">Registered Conferences</span>
                </div>
                <div className="stat-card card">
                    <span className="stat-value">{stats.upcomingSessions}</span>
                    <span className="stat-label">Upcoming Sessions</span>
                </div>
                <div className="stat-card card">
                    <span className="stat-value">{stats.certificatesEarned}</span>
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
};

export default Overview;
