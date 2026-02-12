import { useState, useEffect } from 'react';
import { 
    Shield, 
    Calendar, 
    FileText, 
    ChevronRight, 
    Search, 
    Plus, 
    Settings, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ExternalLink,
    ArrowLeft,
    Users,
    Activity,
    Trash2
} from 'lucide-react';
import { chairAPI } from '../../api';
import ConferenceModal from '../admin/ConferenceModal';

const ChairPortal = () => {
    const [conferences, setConferences] = useState([]);
    const [selectedConf, setSelectedConf] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subLoading, setSubLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // Assignment State
    const [assignModal, setAssignModal] = useState({ open: false, submissionId: null });
    const [assignLoading, setAssignLoading] = useState(false);

    // Conference Management State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConference, setEditingConference] = useState(null);

    useEffect(() => {
        fetchManagedConferences();
        fetchReviewers();
    }, []);

    const fetchManagedConferences = async () => {
        try {
            setLoading(true);
            const res = await chairAPI.getManagedConferences();
            setConferences(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching managed conferences:', err);
            setLoading(false);
        }
    };

    const fetchReviewers = async () => {
        try {
            const res = await chairAPI.getAvailableReviewers();
            setReviewers(res.data.data);
        } catch (err) {
            console.error('Error fetching reviewers:', err);
        }
    };

    const handleViewSubmissions = async (conf) => {
        try {
            setSelectedConf(conf);
            setSubLoading(true);
            const res = await chairAPI.getConferenceSubmissions(conf._id);
            setSubmissions(res.data.data);
            setSubLoading(false);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            setSubLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await chairAPI.updateSubmissionStatus(id, newStatus);
            setSubmissions(prev => 
                prev.map(sub => sub._id === id ? { ...sub, status: newStatus } : sub)
            );
        } catch (err) {
            console.error('Error updating status:', err);
            alert(err.response?.data?.message || 'Error updating status');
        }
    };

    const handleAssignReviewer = async (reviewerId) => {
        try {
            setAssignLoading(true);
            await chairAPI.assignReviewer({ 
                submissionId: assignModal.submissionId, 
                reviewerId 
            });
            setAssignModal({ open: false, submissionId: null });
            alert('Reviewer assigned successfully');
            // Refresh submissions to reflect any changes if needed
            fetchManagedConferences(); // To update pending counts
            setAssignLoading(false);
        } catch (err) {
            console.error('Error assigning reviewer:', err);
            alert(err.response?.data?.message || 'Error assigning reviewer');
            setAssignLoading(false);
        }
    };

    const handleCreateConference = async (data) => {
        try {
            await chairAPI.createConference(data);
            setIsModalOpen(false);
            fetchManagedConferences();
            alert('Conference created successfully');
        } catch (err) {
            console.error('Error creating conference:', err);
            alert(err.response?.data?.message || 'Error creating conference');
        }
    };

    const handleUpdateConference = async (data) => {
        try {
            await chairAPI.updateConference(editingConference._id, data);
            setIsModalOpen(false);
            setEditingConference(null);
            fetchManagedConferences();
            alert('Conference updated successfully');
        } catch (err) {
            console.error('Error updating conference:', err);
            alert(err.response?.data?.message || 'Error updating conference');
        }
    };

    const handleDeleteConference = async (id) => {
        if (window.confirm('Are you sure you want to delete this conference and all associated data?')) {
            try {
                await chairAPI.deleteConference(id);
                fetchManagedConferences();
                alert('Conference deleted successfully');
            } catch (err) {
                console.error('Error deleting conference:', err);
                alert(err.response?.data?.message || 'Error deleting conference');
            }
        }
    };

    const openCreateModal = () => {
        setEditingConference(null);
        setIsModalOpen(true);
    };

    const openEditModal = (conf) => {
        setEditingConference(conf);
        setIsModalOpen(true);
    };

    const filteredSubmissions = submissions.filter(sub => {
        const matchesSearch = 
            sub.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.author?.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    const totalSubmissions = conferences.reduce((acc, conf) => acc + (conf.stats?.submissions || 0), 0);
    const totalPendingReviews = conferences.reduce((acc, conf) => acc + (conf.stats?.pendingReviews || 0), 0);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-zinc-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Portal Initializing...</p>
            </div>
        );
    }

    // Final UI Rendering
    return (
        <div className="flex-1">
            {!selectedConf ? (
                <div className="flex-1 flex flex-col gap-8 animate-fade-in pb-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Managed Conferences</h3>
                        <button 
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                        >
                            <Plus className="w-4 h-4" /> Host New Event
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {conferences.map(conf => (
                            <div key={conf._id} className="bg-white p-8 rounded-[3rem] border border-zinc-200 shadow-sm group hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-4 bg-zinc-50 rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        conf.status === 'upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    }`}>
                                        {conf.status}
                                    </span>
                                </div>
                                <h4 className="text-xl font-black text-zinc-900 mb-2 truncate">{conf.title}</h4>
                                <p className="text-xs font-bold text-zinc-500 mb-8 line-clamp-2">{conf.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-zinc-50 rounded-2xl">
                                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Submissions</p>
                                        <p className="text-lg font-black text-zinc-900">{conf.stats?.submissions || 0}</p>
                                    </div>
                                    <div className="p-4 bg-zinc-50 rounded-2xl">
                                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Reviews</p>
                                        <p className="text-lg font-black text-zinc-900">{conf.stats?.allReviews || 0}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleViewSubmissions(conf)}
                                        className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Review Papers <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button className="p-4 bg-zinc-50 text-zinc-400 rounded-2xl hover:bg-zinc-100 hover:text-zinc-600 transition-all" title="Edit Conference" onClick={(e) => { e.stopPropagation(); openEditModal(conf); }}>
                                        <Settings className="w-5 h-5" />
                                    </button>
                                    <button className="p-4 bg-zinc-50 text-zinc-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all" title="Delete Conference" onClick={(e) => { e.stopPropagation(); handleDeleteConference(conf._id); }}>
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {conferences.length === 0 && (
                            <div className="col-span-full py-32 bg-white rounded-[3rem] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-center">
                                <Shield className="w-20 h-20 text-zinc-50 mb-6" />
                                <h4 className="text-xl font-black text-zinc-900">No active conferences</h4>
                                <p className="text-sm font-bold text-zinc-400 mt-2 max-w-xs">You haven't socialized any events yet. Lead the way and create your first conference!</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-8 animate-fade-in pb-12">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => setSelectedConf(null)}
                            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Back to Portal</span>
                        </button>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Managing Conference</p>
                            <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">{selectedConf.title}</h2>
                        </div>
                    </div>

                    {subLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-zinc-200 border-dashed">
                            <div className="w-10 h-10 border-4 border-zinc-50 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Retrieving Submissions...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {/* Filters */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder="Search submissions or authors..."
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="w-full md:w-48 px-4 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer hover:border-zinc-300 transition-all"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-zinc-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-zinc-100">
                                            <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Submission Details</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Review Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {filteredSubmissions.map(sub => (
                                            <tr key={sub._id} className="group hover:bg-zinc-50/20 transition-colors">
                                                <td className="px-8 py-8">
                                                    <div className="flex gap-4">
                                                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-zinc-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{sub.title}</p>
                                                            <p className="text-[10px] font-bold text-zinc-500 mt-1">{sub.author?.username} • {sub.author?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${getStatusStyles(sub.status)}`}>
                                                        {sub.status === 'Accepted' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                                                         sub.status === 'Rejected' ? <XCircle className="w-3.5 h-3.5" /> : 
                                                         <Clock className="w-3.5 h-3.5" />}
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => setAssignModal({ open: true, submissionId: sub._id })}
                                                            className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-xl transition-all shadow-sm" title="Assign Reviewer"
                                                        >
                                                            <Users className="w-5 h-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(sub._id, 'Accepted')}
                                                            className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 rounded-xl transition-all shadow-sm" title="Approve"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(sub._id, 'Rejected')}
                                                            className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all shadow-sm" title="Reject"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                        <a 
                                                            href={sub.filePath} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all shadow-md" title="View Manuscript"
                                                        >
                                                            <ExternalLink className="w-5 h-5" />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredSubmissions.length === 0 && (
                                    <div className="py-32 text-center flex flex-col items-center">
                                        <Users className="w-16 h-16 text-zinc-50 mb-4" />
                                        <h4 className="text-sm font-black text-zinc-900 uppercase">Waitlist Empty</h4>
                                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">No matching submissions found for this session.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Assign Reviewer Modal */}
                    {assignModal.open && (
                        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                            <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-zinc-200 shadow-2xl overflow-hidden animate-scale-in">
                                <div className="p-8 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-zinc-900 uppercase tracking-tight">Assign Reviewer</h4>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Expert Pool</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setAssignModal({ open: false, submissionId: null })}
                                        className="p-2 bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900 rounded-xl transition-all"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="p-8 max-h-[400px] overflow-y-auto">
                                    <div className="space-y-3">
                                        {reviewers.map(reviewer => (
                                            <button
                                                key={reviewer._id}
                                                onClick={() => handleAssignReviewer(reviewer._id)}
                                                disabled={assignLoading}
                                                className="w-full p-6 bg-white border border-zinc-200 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50/50 group transition-all text-left flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="font-black text-zinc-900 group-hover:text-indigo-600 transition-colors uppercase text-sm">{reviewer.username}</p>
                                                    <p className="text-[10px] font-medium text-zinc-400 mt-0.5">{reviewer.email}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                        {reviewers.length === 0 && (
                                            <div className="text-center py-10">
                                                <p className="text-sm font-bold text-zinc-400">No reviewers available in the system.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 bg-zinc-50 border-t border-zinc-100">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-center">
                                        Selection will immediately notify the reviewer
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ConferenceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingConference ? handleUpdateConference : handleCreateConference}
                initialData={editingConference}
            />
        </div>
    );

};

export default ChairPortal;
