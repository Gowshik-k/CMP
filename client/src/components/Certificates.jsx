import React, { useState, useEffect } from 'react';
import { Download, Award, FileText, ExternalLink, Loader2 } from 'lucide-react';

const Certificates = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/attendee/certificates')
            .then(res => res.json())
            .then(data => {
                setItems(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching certificates:', err);
                setLoading(false);
            });
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'Certificate': return <Award size={24} className="text-yellow-500" />;
            case 'Material': return <FileText size={24} className="text-blue-500" />;
            default: return <FileText size={24} className="text-green-500" />;
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loader"></div>
                <p>Loading your certificates and materials...</p>
            </div>
        );
    }

    return (
        <div className="certificates-view">
            <div className="view-header">
                <h1>Certificates & Materials</h1>
                <p>Access your earned certificates and conference learning materials.</p>
            </div>

            <div className="materials-grid">
                {items.map((item) => (
                    <div key={item.id} className="material-card card">
                        <div className="material-icon">{getIcon(item.type)}</div>
                        <div className="material-info">
                            <span className="material-type">{item.type}</span>
                            <h3 className="material-title">{item.title}</h3>
                            <p className="material-conf">{item.conference}</p>
                            <span className="material-date">{item.date}</span>
                        </div>
                        <div className="material-actions">
                            <button className="btn-icon">
                                <Download size={20} />
                            </button>
                            <button className="btn-icon">
                                <ExternalLink size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Certificates;
