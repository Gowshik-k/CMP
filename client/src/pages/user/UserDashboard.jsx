import { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    ClipboardList, 
    FileText, 
    User, 
    LogOut, 
    Bell,
    ChevronRight,
    Search
} from 'lucide-react';
import { participantAPI } from '../../api';
import UserConferenceBrowser from './UserConferenceBrowser';
import RegistrationModal from './RegistrationModal';
import SubmissionModal from './SubmissionModal';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal States
    const [showRegModal, setShowRegModal] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);
    const [selectedConf, setSelectedConf] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await participantAPI.getDashboardData();
                setUserData(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [refreshKey]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleRegister = async (conferenceId) => {
        try {
            await participantAPI.register(conferenceId);
            setShowRegModal(false);
            setRefreshKey(prev => prev + 1);
            alert('Successfully registered!');
        } catch (err) {
            console.error('Registration error:', err);
            alert(err.response?.data?.message || 'Error registering');
        }
    };

    const handleSubmission = async (data) => {
        try {
            await participantAPI.submitPaper(data);
            setShowSubModal(false);
            setRefreshKey(prev => prev + 1);
            alert('Paper submitted successfully!');
        } catch (err) {
            console.error('Submission error:', err);
            alert('Error submitting paper');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'conferences', name: 'Conferences', icon: Calendar },
        { id: 'registrations', name: 'My Registrations', icon: ClipboardList },
        { id: 'submissions', name: 'My Submissions', icon: FileText },
        { id: 'profile', name: 'Profile', icon: User },
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] bg-zinc-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="flex items-center gap-3 px-2 py-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-zinc-900 truncate">{user?.username}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                activeTab === tab.id
                                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10'
                                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                            }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-zinc-400'}`} />
                            {tab.name}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0">
                    <h2 className="text-xl font-bold text-zinc-900 capitalize">{activeTab.replace('-', ' ')}</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-zinc-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold text-zinc-900">{user?.username}</p>
                                <p className="text-[10px] font-medium text-zinc-500">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* Welcome Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('registrations')}>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Registrations</p>
                                    <h3 className="text-3xl font-bold text-zinc-900">{userData?.registrations?.length || 0}</h3>
                                    <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
                                        Active events
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('submissions')}>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Submissions</p>
                                    <h3 className="text-3xl font-bold text-zinc-900">{userData?.submissions?.length || 0}</h3>
                                    <p className="text-[10px] text-blue-600 font-bold mt-2 flex items-center gap-1">
                                        Papers submitted
                                    </p>
                                </div>
                                <div className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-500/20 text-white">
                                    <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">Account Role</p>
                                    <h3 className="text-3xl font-bold">{user?.role}</h3>
                                    <p className="text-[10px] text-blue-100 font-bold mt-2">
                                        Member since {new Date(user?.createdAt).getFullYear()}
                                    </p>
                                </div>
                            </div>

                            {/* Recent Activity Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="font-bold text-zinc-900">Registered Conferences</h4>
                                        <button onClick={() => setActiveTab('registrations')} className="text-xs font-bold text-blue-600 hover:underline">View all</button>
                                    </div>
                                    <div className="space-y-4">
                                        {userData?.registrations?.length > 0 ? (
                                            userData.registrations.slice(0, 3).map((reg) => (
                                                <div key={reg._id} className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 text-blue-500">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-bold text-zinc-900 truncate">{reg.conference.title}</p>
                                                        <p className="text-[10px] text-zinc-500">{new Date(reg.conference.startDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                                                        {reg.status}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-zinc-400 text-center py-4">No registrations yet.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="font-bold text-zinc-900">Recent Submissions</h4>
                                        <button onClick={() => setActiveTab('submissions')} className="text-xs font-bold text-blue-600 hover:underline">View all</button>
                                    </div>
                                    <div className="space-y-4">
                                        {userData?.submissions?.length > 0 ? (
                                            userData.submissions.slice(0, 3).map((sub) => (
                                                <div key={sub._id} className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-indigo-500">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-bold text-zinc-900 truncate">{sub.title}</p>
                                                        <p className="text-[10px] text-zinc-500">{sub.conference.title}</p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                        sub.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' :
                                                        sub.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                        'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        {sub.status}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-zinc-400 text-center py-4">No submissions yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'conferences' && (
                        <div className="animate-fade-in-up">
                            <UserConferenceBrowser 
                                onRegister={(conf) => {
                                    setSelectedConf(conf);
                                    setShowRegModal(true);
                                }}
                                onSubmitPaper={(conf) => {
                                    setSelectedConf(conf);
                                    setShowSubModal(true);
                                }}
                            />
                        </div>
                    )}

                    {activeTab === 'registrations' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-zinc-100">
                                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Conference</th>
                                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Dates</th>
                                            <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {userData?.registrations?.map((reg) => (
                                            <tr key={reg._id} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <p className="font-bold text-zinc-900">{reg.conference.title}</p>
                                                    <p className="text-[10px] text-zinc-500">ID: {reg._id.slice(-8)}</p>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-zinc-600 font-medium">{reg.conference.location}</td>
                                                <td className="px-6 py-5 text-sm text-zinc-600 font-medium">
                                                    {new Date(reg.conference.startDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold">
                                                        {reg.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {userData?.registrations?.length === 0 && (
                                    <div className="py-12 text-center text-zinc-400 text-sm">No registrations found.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                            {userData?.submissions?.map((sub) => (
                                <div key={sub._id} className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm flex flex-col group">
                                    <div className="flex justify-between mb-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                            sub.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' :
                                            sub.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                            {sub.status}
                                        </span>
                                        <p className="text-[10px] font-bold text-zinc-400 capitalize">Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                                    </div>
                                    <h5 className="text-lg font-bold text-zinc-900 mb-2 truncate" title={sub.title}>{sub.title}</h5>
                                    <p className="text-xs text-zinc-500 mb-4 font-bold">Conference: {sub.conference.title}</p>
                                    <p className="text-sm text-zinc-500 line-clamp-2 mb-6 flex-1 italic">"{sub.abstract}"</p>
                                    <div className="pt-4 border-t border-zinc-50 flex justify-between items-center">
                                        <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                            <FileText className="w-3.5 h-3.5" />
                                            View Submission
                                        </button>
                                        <span className="text-[10px] text-zinc-400 font-medium">ID: {sub._id.slice(-8)}</span>
                                    </div>
                                </div>
                            ))}
                            {userData?.submissions?.length === 0 && (
                                <div className="col-span-full py-12 text-center text-zinc-400 text-sm bg-white rounded-3xl border border-dashed border-zinc-200">
                                    No submissions found.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-2xl bg-white rounded-[2.5rem] border border-zinc-200 p-10 animate-fade-in-up">
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-32 h-32 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-indigo-500/30">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold text-zinc-900">{user?.username}</h3>
                                    <p className="text-sm text-zinc-500 font-medium">{user?.email}</p>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-100 rounded-full text-xs font-bold text-zinc-600">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    {user?.role} Account
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-zinc-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Phone Number</p>
                                    <p className="text-sm font-bold text-zinc-900">{user?.phoneNumber}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Account Status</p>
                                    <p className="text-sm font-bold text-emerald-600">Verified</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</p>
                                    <p className="text-sm font-medium text-zinc-400 italic">Not set (Edit profile coming soon)</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Member Since</p>
                                    <p className="text-sm font-bold text-zinc-900">{formatDate(user?.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            <RegistrationModal 
                isOpen={showRegModal}
                onClose={() => setShowRegModal(false)}
                onConfirm={handleRegister}
                conference={selectedConf}
            />
            <SubmissionModal 
                isOpen={showSubModal}
                onClose={() => setShowSubModal(false)}
                onSubmit={handleSubmission}
                conference={selectedConf}
            />
        </div>
    );
};

export default UserDashboard;
