import React, { useState, useEffect } from 'react';
import { User, Mail, Building2, Edit3, Calendar, FileText, CheckCircle2, XCircle, Clock, MapPin } from 'lucide-react';
import axios from 'axios';

const Overview = () => {
    const [user, setUser] = useState(null);
    const [conferences, setConferences] = useState([]);
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                const savedUser = localStorage.getItem('user');

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }

                // Fetch conferences attended (mock data for now)
                setConferences([
                    {
                        id: 1,
                        title: 'International Conference on Computer Science 2026',
                        topic: 'Artificial Intelligence & Machine Learning',
                        date: '2026-03-15',
                        time: '09:00 AM',
                        status: 'attended',
                        location: 'New Delhi, India'
                    },
                    {
                        id: 2,
                        title: 'National Symposium on Data Science',
                        topic: 'Big Data Analytics',
                        date: '2026-02-20',
                        time: '10:30 AM',
                        status: 'not-attended',
                        location: 'Mumbai, India'
                    },
                    {
                        id: 3,
                        title: 'IEEE Conference on Cybersecurity',
                        topic: 'Network Security & Cryptography',
                        date: '2026-04-10',
                        time: '11:00 AM',
                        status: 'attended',
                        location: 'Bangalore, India'
                    }
                ]);

                // Fetch submitted papers (mock data for now)
                setPapers([
                    {
                        id: 1,
                        title: 'Deep Learning Approaches for Natural Language Processing',
                        conference: 'International Conference on Computer Science 2026',
                        submissionDate: '2026-01-15',
                        status: 'accepted'
                    },
                    {
                        id: 2,
                        title: 'Blockchain Technology in Healthcare Systems',
                        conference: 'National Symposium on Data Science',
                        submissionDate: '2026-01-20',
                        status: 'under-review'
                    },
                    {
                        id: 3,
                        title: 'Quantum Computing and Cryptographic Algorithms',
                        conference: 'IEEE Conference on Cybersecurity',
                        submissionDate: '2026-02-01',
                        status: 'rejected'
                    }
                ]);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusBadge = (status) => {
        const badges = {
            'attended': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'Attended' },
            'not-attended': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'Not Attended' },
            'accepted': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'Accepted' },
            'rejected': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle, label: 'Rejected' },
            'under-review': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'Under Review' }
        };
        return badges[status] || badges['under-review'];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in-up">
            {/* Profile Section */}
            <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                            {user?.image ? (
                                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                                    <User className="w-16 h-16 text-zinc-400" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-8 px-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-zinc-900 mb-2">{user?.name || user?.username || 'Attendee'}</h2>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm font-medium">{user?.email || 'email@example.com'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <Building2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">{user?.institution || 'University Name'}</span>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-zinc-900">{conferences.length}</p>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Conferences</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-zinc-900">{papers.length}</p>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Papers</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-zinc-900">{conferences.filter(c => c.status === 'attended').length}</p>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Attended</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conferences Attended Section */}
            <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-zinc-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-zinc-900 mb-1">Conferences Attended</h3>
                            <p className="text-sm text-zinc-500 font-medium">Your conference participation history</p>
                        </div>
                        <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                            <span className="text-sm font-bold text-blue-700">{conferences.length} Total</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50/50 border-b border-zinc-100">
                            <tr className="text-left">
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Conference</th>
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Topic</th>
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Location</th>
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {conferences.map((conf) => {
                                const statusBadge = getStatusBadge(conf.status);
                                const StatusIcon = statusBadge.icon;
                                return (
                                    <tr key={conf.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-zinc-900 max-w-xs">{conf.title}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm text-zinc-600 font-medium">{conf.topic}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                                    {new Date(conf.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="text-xs text-zinc-500 font-medium">{conf.time}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                                {conf.location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {statusBadge.label}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Submitted Papers Section */}
            <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-zinc-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-zinc-900 mb-1">Submitted Papers</h3>
                            <p className="text-sm text-zinc-500 font-medium">Track your paper submissions and review status</p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="text-sm font-bold text-emerald-700">{papers.filter(p => p.status === 'accepted').length} Accepted</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50/50 border-b border-zinc-100">
                            <tr className="text-left">
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Paper Title</th>
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Conference</th>
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Submission Date</th>
                                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Review Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {papers.map((paper) => {
                                const statusBadge = getStatusBadge(paper.status);
                                const StatusIcon = statusBadge.icon;
                                return (
                                    <tr key={paper.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-zinc-900 max-w-md">{paper.title}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm text-zinc-600 font-medium max-w-xs">{paper.conference}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                                {new Date(paper.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {statusBadge.label}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;
