import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, CheckCircle, Loader2 } from 'lucide-react';

const ConferenceRegistration = () => {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registeredIds, setRegisteredIds] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/attendee/conferences')
            .then(res => res.json())
            .then(data => {
                setConferences(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching conferences:', err);
                setLoading(false);
            });
    }, []);

    const handleRegister = (id) => {
        fetch('http://localhost:5000/api/attendee/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conferenceId: id })
        })
            .then(res => res.json())
            .then(() => {
                if (!registeredIds.includes(id)) {
                    setRegisteredIds([...registeredIds, id]);
                }
            })
            .catch(err => console.error('Error registering:', err));
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loader"></div>
                <p>Loading available conferences...</p>
            </div>
        );
    }

    return (
        <div className="registration-view">
            <div className="view-header">
                <h1>Available Conferences</h1>
                <p>Explore and register for upcoming academic and professional conferences.</p>
            </div>

            <div className="filter-bar">
                <div className="category-filters">
                    <button className="filter-chip active">All</button>
                    <button className="filter-chip">Technology</button>
                    <button className="filter-chip">Science</button>
                    <button className="filter-chip">Healthcare</button>
                </div>
            </div>

            <div className="conference-grid">
                {conferences.map((conf) => (
                    <div key={conf.id} className="conference-card card">
                        <div className="conf-image" style={{ backgroundImage: `url(${conf.image})` }}>
                            <span className={`status-badge ${conf.status.toLowerCase()}`}>{conf.status}</span>
                        </div>
                        <div className="conf-details">
                            <span className="conf-category">{conf.category}</span>
                            <h3 className="conf-title">{conf.title}</h3>

                            <div className="conf-info">
                                <div className="info-item">
                                    <Calendar size={16} />
                                    <span>{conf.date}</span>
                                </div>
                                <div className="info-item">
                                    <MapPin size={16} />
                                    <span>{conf.location}</span>
                                </div>
                                <div className="info-item">
                                    <Users size={16} />
                                    <span>{conf.attendees} Registered</span>
                                </div>
                            </div>

                            <div className="conf-actions">
                                {registeredIds.includes(conf.id) ? (
                                    <button className="btn btn-secondary registered" disabled>
                                        <CheckCircle size={18} />
                                        <span>Registered</span>
                                    </button>
                                ) : (
                                    <button className="btn btn-primary register-btn" onClick={() => handleRegister(conf.id)}>
                                        Register Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConferenceRegistration;
