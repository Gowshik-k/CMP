import React, { useState, useEffect } from 'react';
import { Clock, User, MessageSquare, MapPin, Loader2 } from 'lucide-react';

const Schedules = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/attendee/schedules')
            .then(res => res.json())
            .then(data => {
                setSessions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching schedules:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loader"></div>
                <p>Loading your schedule...</p>
            </div>
        );
    }

    return (
        <div className="schedules-view">
            <div className="view-header">
                <h1>My Schedule</h1>
                <p>Your personalized timeline for the registered conferences.</p>
            </div>

            <div className="schedule-timeline">
                {sessions.map((session) => (
                    <div key={session.id} className="timeline-item card fade-in">
                        <div className="session-time">
                            <Clock size={16} />
                            <span>{session.time}</span>
                        </div>

                        <div className="session-main">
                            <div className="session-type-badge">{session.type}</div>
                            <h3 className="session-title">{session.title}</h3>

                            <div className="session-meta">
                                <div className="meta-item">
                                    <User size={16} />
                                    <span>{session.speaker}</span>
                                </div>
                                <div className="meta-item">
                                    <MapPin size={16} />
                                    <span>{session.room}</span>
                                </div>
                            </div>
                        </div>

                        <div className="session-actions">
                            <button className="btn btn-secondary btn-sm">
                                <MessageSquare size={16} />
                                <span>Join Chat</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedules;
