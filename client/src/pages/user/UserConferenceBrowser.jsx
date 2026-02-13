import { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, PlusCircle, FileText, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { participantAPI } from '../../api';

const UserConferenceBrowser = ({ onRegister, onSubmitPaper }) => {
    const [conferences, setConferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchConferences();
    }, []);

    const fetchConferences = async () => {
        try {
            const res = await participantAPI.getConferences();
            setConferences(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching conferences:', err);
            setLoading(false);
        }
    };

    const filteredConferences = conferences.filter(conf =>
        conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conf.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group max-w-md">
                <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Find a conference..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                {filteredConferences.map((conf) => (
                    <div key={conf._id} className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm hover:shadow-xl hover:shadow-zinc-200/40 transition-all flex flex-col group h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                conf.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                                conf.status === 'ongoing' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-zinc-100 text-zinc-500'
                            }`}>
                                {conf.status}
                            </span>
                            {conf.isRegistered && (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Registered
                                </span>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-zinc-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{conf.title}</h3>
                            <p className="text-sm text-zinc-500 line-clamp-3 mb-6">{conf.description}</p>
                            
                            <div className="grid grid-cols-2 gap-y-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4.5 h-4.5 text-zinc-400" />
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date</p>
                                        <p className="text-xs font-bold text-zinc-900">{formatDate(conf.startDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4.5 h-4.5 text-zinc-400" />
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Location</p>
                                        <p className="text-xs font-bold text-zinc-900 truncate max-w-[120px]">{conf.location}</p>
                                    </div>
                                </div>
                                {conf.submissionDeadline && (
                                    <div className="flex items-center gap-3 col-span-2 text-amber-600 bg-amber-50/50 p-2 rounded-xl">
                                        <Clock className="w-4 h-4" />
                                        <p className="text-xs font-bold">Deadline: {formatDate(conf.submissionDeadline)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-6 border-t border-zinc-50 mt-auto">
                            {!conf.isRegistered ? (
                                <button 
                                    onClick={() => onRegister(conf)}
                                    className="flex-1 px-4 py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Register
                                </button>
                            ) : (
                                <button 
                                    disabled
                                    className="flex-1 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm cursor-default flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Registered
                                </button>
                            )}
                            {conf.isRegistered && conf.intendToSubmit && (
                                <button 
                                    onClick={() => onSubmitPaper(conf)}
                                    className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:border-zinc-900 hover:text-zinc-900 transition-all flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Submit Paper
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredConferences.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-zinc-200 border-dashed">
                    <Calendar className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                    <h4 className="font-bold text-zinc-900">No conferences found</h4>
                    <p className="text-sm text-zinc-500">Try searching with a different term.</p>
                </div>
            )}
        </div>
    );
};

export default UserConferenceBrowser;
