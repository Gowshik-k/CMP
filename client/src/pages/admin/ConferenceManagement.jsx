import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, MapPin, Edit2, Trash2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminAPI } from '../../api';
import ConferenceModal from './ConferenceModal';

const ConferenceManagement = ({ onUpdate }) => {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('upcoming'); // 'upcoming' or 'history'
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedConference, setSelectedConference] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchConferences = async () => {
            try {
                const res = await adminAPI.getAllConferences();
                setConferences(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching conferences:', err);
                setLoading(false);
            }
        };
        fetchConferences();
    }, [refreshKey]);

    const prepareData = (data) => {
        const cleaned = { ...data };
        if (!cleaned.submissionDeadline) delete cleaned.submissionDeadline;
        return cleaned;
    };

    const handleCreate = async (data) => {
        try {
            await adminAPI.createConference(prepareData(data));
            setShowModal(false);
            setRefreshKey(prev => prev + 1);
            onUpdate?.();
        } catch (err) {
            console.error('Error creating conference:', err);
            alert('Failed to create conference. Please check the console for details.');
        }
    };

    const handleUpdate = async (data) => {
        try {
            await adminAPI.updateConference(selectedConference._id, prepareData(data));
            setShowModal(false);
            setSelectedConference(null);
            setRefreshKey(prev => prev + 1);
            onUpdate?.();
        } catch (err) {
            console.error('Error updating conference:', err);
            alert('Failed to update conference. Please check the console for details.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this conference?')) {
            try {
                await adminAPI.deleteConference(id);
                setRefreshKey(prev => prev + 1);
                onUpdate?.();
            } catch (err) {
                console.error('Error deleting conference:', err);
            }
        }
    };

    const openEditModal = (conference) => {
        setSelectedConference(conference);
        setShowModal(true);
    };

    const openCreateModal = () => {
        setSelectedConference(null);
        setShowModal(true);
    };

    // Filter conferences based on view and search query
    const filteredConferences = conferences.filter(conf => {
        const matchesSearch = conf.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              conf.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        const now = new Date();
        const endDate = new Date(conf.endDate);
        
        const matchesView = view === 'upcoming' 
            ? endDate >= now 
            : endDate < now;

        return matchesSearch && matchesView;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in-up">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="bg-zinc-100 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => setView('upcoming')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            view === 'upcoming' 
                            ? 'bg-white text-zinc-900 shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setView('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            view === 'history' 
                            ? 'bg-white text-zinc-900 shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                        History
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search conferences..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-4.5 h-4.5" />
                        <span>New Conference</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredConferences.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-6">
                        {filteredConferences.map((conf) => (
                            <div key={conf._id} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button 
                                        onClick={() => openEditModal(conf)}
                                        className="p-2 bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-zinc-400"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(conf._id)}
                                        className="p-2 bg-zinc-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-zinc-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-start mb-4 pr-16">
                                    <div>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-3 ${
                                            conf.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                                            conf.status === 'ongoing' ? 'bg-emerald-50 text-emerald-600' :
                                            conf.status === 'completed' ? 'bg-zinc-100 text-zinc-500' :
                                            'bg-red-50 text-red-600'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                conf.status === 'upcoming' ? 'bg-blue-500' :
                                                conf.status === 'ongoing' ? 'bg-emerald-500' :
                                                conf.status === 'completed' ? 'bg-zinc-500' :
                                                'bg-red-500'
                                            }`}></span>
                                            {conf.status}
                                        </span>
                                        <h3 className="text-xl font-bold text-zinc-900 leading-tight mb-2">{conf.title}</h3>
                                        <p className="text-sm text-zinc-500 line-clamp-2">{conf.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date</p>
                                            <p className="text-xs font-bold text-zinc-900">{formatDate(conf.startDate)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Location</p>
                                            <p className="text-xs font-bold text-zinc-900 truncate max-w-[120px]" title={conf.location}>{conf.location}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {conf.submissionDeadline && (
                                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-lg max-w-fit">
                                        <AlertCircle className="w-4 h-4" />
                                        Deadline: {formatDate(conf.submissionDeadline)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-zinc-300" />
                    </div>
                    <h4 className="text-lg font-bold text-zinc-900 mb-1">No conferences found</h4>
                    <p className="text-sm text-zinc-500 mb-6">
                        {searchQuery ? "Try adjusting your search terms." : `No ${view} conferences available.`}
                    </p>
                    {!searchQuery && view === 'upcoming' && (
                        <button 
                            onClick={openCreateModal}
                            className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all"
                        >
                            Create First Conference
                        </button>
                    )}
                </div>
            )}

            <ConferenceModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={selectedConference ? handleUpdate : handleCreate}
                initialData={selectedConference}
            />
        </div>
    );
};

export default ConferenceManagement;
