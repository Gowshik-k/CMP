import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, Search, ExternalLink, Filter } from 'lucide-react';
import { adminAPI } from '../../api';

const SubmissionManagement = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getAllSubmissions();
            setSubmissions(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await adminAPI.updateSubmissionStatus(id, newStatus);
            setSubmissions(prev => 
                prev.map(sub => sub._id === id ? { ...sub, status: newStatus } : sub)
            );
        } catch (err) {
            console.error('Error updating status:', err);
            alert(err.response?.data?.message || 'Error updating status');
        }
    };

    const filteredSubmissions = submissions.filter(sub => {
        const matchesSearch = 
            sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.author?.username.toLowerCase().includes(searchTerm.toLowerCase());
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Accepted': return <CheckCircle2 className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
                <div className="w-12 h-12 border-4 border-zinc-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500 font-medium">Loading submissions...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col gap-6 overflow-hidden animate-fade-in">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter className="w-4 h-4 text-zinc-400 hidden md:block" />
                    <select
                        className="flex-1 md:flex-none px-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Submissions List */}
            <div className="flex-1 bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Submission Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Conference</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map((sub) => (
                                    <tr key={sub._id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusStyles(sub.status)} transition-transform group-hover:scale-110`}>
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 mb-0.5 group-hover:text-blue-600 transition-colors">{sub.title}</p>
                                                    <p className="text-xs text-zinc-500 font-medium">{sub.author?.username} • {sub.author?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-zinc-700">{sub.conference?.title}</p>
                                            <p className="text-[10px] text-zinc-400 font-medium">Submitted {new Date(sub.submittedAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(sub.status)}`}>
                                                {getStatusIcon(sub.status)}
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleStatusUpdate(sub._id, 'Accepted')}
                                                    className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Accept"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(sub._id, 'Rejected')}
                                                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <a 
                                                    href={sub.filePath} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="View Paper"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                                <FileText className="w-8 h-8 text-zinc-300" />
                                            </div>
                                            <h4 className="text-lg font-bold text-zinc-900 mb-1">No submissions found</h4>
                                            <p className="text-sm text-zinc-500">Try adjusting your search terms or filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubmissionManagement;
