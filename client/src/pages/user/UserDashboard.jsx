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
    Search,
    MapPin,
    CheckCircle2,
    Globe,
    Linkedin,
    Twitter,
    Save,
    X,
    ExternalLink,
    GraduationCap,
    Shield,
    BookOpen
} from 'lucide-react';
import { participantAPI } from '../../api';
import UserConferenceBrowser from './UserConferenceBrowser';
import RegistrationModal from './RegistrationModal';
import SubmissionModal from './SubmissionModal';
import ChairPortal from './ChairPortal';
import ReviewerPortal from './ReviewerPortal';

const UserDashboard = ({ user, setUser }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Modal States
    const [showRegModal, setShowRegModal] = useState(false);
    const [showSubModal, setShowSubModal] = useState(false);
    const [selectedConf, setSelectedConf] = useState(null);

    // Use current user from props (fallback to localStorage if needed, but props preferred)
    const currentUser = user || JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await participantAPI.getDashboardData();
                setUserData(res.data.data);
                // Sync user state if backend returns updated user info
                if (setUser && res.data.data.user) {
                    setUser(res.data.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.data.user));
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [refreshKey]);

    const handleLogout = () => {
        localStorage.clear();
        if (setUser) setUser(null);
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

    // Profile States
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        affiliation: currentUser?.affiliation || '',
        bio: currentUser?.bio || '',
        phoneNumber: currentUser?.phoneNumber || '',
        socialLinks: {
            linkedin: currentUser?.socialLinks?.linkedin || '',
            orcid: currentUser?.socialLinks?.orcid || '',
            twitter: currentUser?.socialLinks?.twitter || ''
        }
    });

    // Update form when user data changes
    useEffect(() => {
        if (currentUser) {
            setProfileForm({
                affiliation: currentUser.affiliation || '',
                bio: currentUser.bio || '',
                phoneNumber: currentUser.phoneNumber || '',
                socialLinks: {
                    linkedin: currentUser.socialLinks?.linkedin || '',
                    orcid: currentUser.socialLinks?.orcid || '',
                    twitter: currentUser.socialLinks?.twitter || ''
                }
            });
        }
    }, [currentUser]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await participantAPI.updateProfile(profileForm);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            if (setUser) setUser(res.data.data);
            setIsEditingProfile(false);
            setRefreshKey(prev => prev + 1);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Profile update error:', err);
            alert(err.response?.data?.message || 'Error updating profile');
        }
    };

    const calculateTrustScore = () => {
        let score = 0;
        if (currentUser?.isEmailVerified) score += 30;
        if (currentUser?.isPhoneVerified) score += 30;
        if (currentUser?.affiliation) score += 10;
        if (currentUser?.bio) score += 15;
        if (currentUser?.socialLinks?.linkedin || currentUser?.socialLinks?.orcid || currentUser?.socialLinks?.twitter) score += 15;
        return score;
    };

    const isFullyVerified = currentUser?.isEmailVerified && currentUser?.isPhoneVerified;

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
        // Role-specific tabs
        ...(currentUser?.role === 'Reviewer' ? [{ id: 'reviews', name: 'Review Assigned', icon: BookOpen }] : []),
        ...(currentUser?.role === 'Chair' ? [{ id: 'portal', name: 'Conference Portal', icon: Shield }] : []),
        { id: 'profile', name: 'Profile', icon: User },
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] bg-zinc-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col shrink-0 z-20">
                <div className="p-6">
                    <div className="flex items-center gap-3 px-2 py-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            {currentUser?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-zinc-900 truncate">{currentUser?.username}</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{currentUser?.role}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 translate-x-1'
                                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                            }`}
                        >
                            <tab.icon className={`w-5 h-5 transition-colors ${activeTab === tab.id ? 'text-blue-400' : 'text-zinc-400'}`} />
                            {tab.name}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-8 shrink-0 z-10">
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative group">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="pl-9 pr-4 py-2 bg-zinc-100 border-transparent rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all"
                            />
                        </div>
                        <button className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        </button>
                        <div className="h-8 w-px bg-zinc-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-zinc-900 leading-none mb-0.5">{currentUser?.username}</p>
                                <p className="text-[10px] font-bold text-zinc-400">{currentUser?.email}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-50/50">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fade-in-up">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div 
                                    className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 shadow-sm cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group" 
                                    onClick={() => setActiveTab('registrations')}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <ClipboardList className="w-5 h-5" />
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Registrations</p>
                                    <h3 className="text-3xl font-black text-zinc-900">{userData?.registrations?.length || 0}</h3>
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-md">ACTIVE</span>
                                        <p className="text-[10px] text-zinc-400 font-bold">Manage your tickets</p>
                                    </div>
                                </div>

                                <div 
                                    className="bg-white p-5 rounded-[1.5rem] border border-zinc-200 shadow-sm cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group" 
                                    onClick={() => setActiveTab('submissions')}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Submissions</p>
                                    <h3 className="text-3xl font-black text-zinc-900">{userData?.submissions?.length || 0}</h3>
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md">PAPERS</span>
                                        <p className="text-[10px] text-zinc-400 font-bold">Track review status</p>
                                    </div>
                                </div>

                                 <div className="bg-zinc-900 p-5 rounded-[1.5rem] shadow-2xl shadow-zinc-900/20 text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Profile Status</p>
                                        <h3 className="text-2xl font-black mb-1">{currentUser?.role}</h3>
                                        <div className="flex items-center gap-2 mt-4">
                                            <CheckCircle2 className={`w-4 h-4 ${isFullyVerified ? 'text-emerald-400' : 'text-zinc-500'}`} />
                                            <p className={`text-[10px] font-bold ${isFullyVerified ? 'text-zinc-400' : 'text-zinc-500 italic'}`}>
                                                {isFullyVerified ? 'Account Verified' : 'Verification Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                                </div>
                            </div>

                            {/* Activity Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-[1.5rem] border border-zinc-200 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-black text-zinc-900 text-lg">My Conferences</h4>
                                            <p className="text-xs font-bold text-zinc-400">Your upcoming events</p>
                                        </div>
                                        <button onClick={() => setActiveTab('registrations')} className="p-2 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-all">
                                            <ChevronRight className="w-5 h-5 text-zinc-400" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {userData?.registrations?.length > 0 ? (
                                            userData.registrations.slice(0, 3).map((reg) => (
                                                <div key={reg._id} className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300">
                                                    <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-blue-600 shadow-sm">
                                                        <Calendar className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="font-black text-zinc-900 truncate text-sm">{reg.conference.title}</p>
                                                        <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {reg.conference.location}
                                                        </p>
                                                    </div>
                                                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border border-emerald-100/50">
                                                        {reg.status}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 opacity-40">
                                                <Calendar className="w-12 h-12 mx-auto mb-2" />
                                                <p className="text-sm font-bold">Not registered yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-[1.5rem] border border-zinc-200 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-black text-zinc-900 text-lg">My Submissions</h4>
                                            <p className="text-xs font-bold text-zinc-400">Track your research papers</p>
                                        </div>
                                        <button onClick={() => setActiveTab('submissions')} className="p-2 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-all">
                                            <ChevronRight className="w-5 h-5 text-zinc-400" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {userData?.submissions?.length > 0 ? (
                                            userData.submissions.slice(0, 3).map((sub) => (
                                                <div key={sub._id} className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-300">
                                                    <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-indigo-600 shadow-sm">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="font-black text-zinc-900 truncate text-sm">{sub.title}</p>
                                                        <p className="text-[10px] font-bold text-zinc-400">{sub.conference.title}</p>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                                                        sub.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                                        sub.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100/50' :
                                                        'bg-blue-50 text-blue-600 border-blue-100/50'
                                                    }`}>
                                                        {sub.status}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 opacity-40">
                                                <FileText className="w-12 h-12 mx-auto mb-2" />
                                                <p className="text-sm font-bold">No submissions yet</p>
                                            </div>
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
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="bg-white rounded-[2.5rem] border border-zinc-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50 border-b border-zinc-100">
                                            <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Conference Details</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Location</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Dates</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {userData?.registrations?.map((reg) => (
                                            <tr key={reg._id} className="hover:bg-zinc-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <p className="font-black text-zinc-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{reg.conference.title}</p>
                                                    <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">Registration Code: {reg._id.slice(-8).toUpperCase()}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                                                        <MapPin className="w-4 h-4 text-zinc-300" />
                                                        {reg.conference.location}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-bold text-zinc-600">
                                                    {formatDate(reg.conference.startDate)}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                        {reg.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {userData?.registrations?.length === 0 && (
                                    <div className="py-24 text-center">
                                        <Calendar className="w-16 h-16 text-zinc-100 mx-auto mb-4" />
                                        <h4 className="font-black text-zinc-900">No active registrations</h4>
                                        <p className="text-sm font-bold text-zinc-400">Discover upcoming conferences and secure your spot.</p>
                                        <button onClick={() => setActiveTab('conferences')} className="mt-6 px-8 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">Browse Events</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
                            {userData?.submissions?.map((sub) => (
                                <div key={sub._id} className="bg-white p-8 rounded-[3rem] border border-zinc-200 shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                                            sub.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                            sub.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100/50' :
                                            'bg-indigo-50 text-indigo-600 border-indigo-100/50'
                                        }`}>
                                            {sub.status}
                                        </span>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Submitted On</p>
                                            <p className="text-xs font-bold text-zinc-900">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <h5 className="text-xl font-black text-zinc-900 mb-2 leading-tight uppercase group-hover:text-indigo-600 transition-colors">{sub.title}</h5>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-6 pb-6 border-b border-zinc-50">Conference: {sub.conference.title}</p>
                                    <p className="text-sm text-zinc-500 line-clamp-3 mb-8 flex-1 italic leading-relaxed font-bold">"{sub.abstract}"</p>
                                    <div className="flex justify-between items-center bg-zinc-50 -mx-8 -mb-8 p-6 rounded-b-[3rem] mt-4 border-t border-zinc-100">
                                        <button className="text-xs font-black text-indigo-600 flex items-center gap-2 hover:scale-105 transition-transform">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            VIEW DETAILS
                                        </button>
                                        <span className="text-[10px] font-black text-zinc-300">ID: {sub._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                            ))}
                            {userData?.submissions?.length === 0 && (
                                <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-zinc-100">
                                    <FileText className="w-16 h-16 text-zinc-50 mx-auto mb-4" />
                                    <h4 className="font-black text-zinc-900">No papers submitted</h4>
                                    <p className="text-sm font-bold text-zinc-400">Ready to share your research? Choose a conference to begin.</p>
                                    <button onClick={() => setActiveTab('conferences')} className="mt-6 px-8 py-3 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">Explore Call for Papers</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-5xl animate-fade-in-up">
                            {/* Simple Header (Seamless) */}
                            <div className="mb-8">
                                <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{currentUser?.username}</h3>
                                <div className="flex gap-3">
                                    <span className="px-3 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{currentUser?.role}</span>
                                    <span className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-500 rounded-full text-[10px] font-black uppercase tracking-widest">Since {new Date(currentUser?.createdAt).getFullYear()}</span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isFullyVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                        <CheckCircle2 className="w-3 h-3" /> {isFullyVerified ? 'Identity Verified' : 'Unverified Account'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-between items-center mb-8">
                                <h4 className="text-xl font-black text-zinc-900 tracking-tight">Profile Details</h4>
                                {!isEditingProfile ? (
                                    <button 
                                        onClick={() => setIsEditingProfile(true)}
                                        className="px-6 py-3 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-3"
                                    >
                                        <User className="w-4 h-4 text-blue-600" />
                                        Edit Particulars
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => setIsEditingProfile(false)}
                                            className="px-5 py-3 bg-zinc-100 text-zinc-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" /> Cancel
                                        </button>
                                        <button 
                                            onClick={handleProfileUpdate}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" /> Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Section: General */}
                                <div className="lg:col-span-2 space-y-8">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <GraduationCap className="w-4 h-4" />
                                            </div>
                                            <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Personal & Academic</h5>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                                                <div className="p-4 rounded-[1.2rem] bg-zinc-100/50 border border-zinc-100 text-zinc-400 font-bold text-xs cursor-not-allowed">
                                                    {currentUser?.email}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                {isEditingProfile ? (
                                                    <input 
                                                        type="text"
                                                        value={profileForm.phoneNumber}
                                                        onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                                                        className="w-full p-4 rounded-[1.2rem] bg-white border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-xs"
                                                        placeholder="+1 (555) 000-0000"
                                                    />
                                                ) : (
                                                    <div className="p-4 rounded-[1.2rem] bg-white border border-zinc-200 text-zinc-900 font-bold text-xs">
                                                        {currentUser?.phoneNumber || 'Not provided'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Affiliation / Institution</label>
                                                {isEditingProfile ? (
                                                    <input 
                                                        type="text"
                                                        value={profileForm.affiliation}
                                                        onChange={(e) => setProfileForm({...profileForm, affiliation: e.target.value})}
                                                        className="w-full p-4 rounded-[1.2rem] bg-white border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-xs"
                                                        placeholder="e.g. Stanford University"
                                                    />
                                                ) : (
                                                    <div className={`p-4 rounded-[1.2rem] bg-white border border-zinc-200 text-xs font-bold ${!currentUser?.affiliation ? 'text-zinc-300 italic' : 'text-zinc-900'}`}>
                                                        {currentUser?.affiliation || 'No institution listed'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Short Bio</label>
                                                {isEditingProfile ? (
                                                    <textarea 
                                                        rows="3"
                                                        value={profileForm.bio}
                                                        onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                                                        className="w-full p-5 rounded-[1.5rem] bg-white border border-zinc-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-xs resize-none"
                                                        placeholder="Write a brief professional bio..."
                                                    />
                                                ) : (
                                                    <div className={`p-5 rounded-[1.5rem] bg-white border border-zinc-200 text-xs font-bold leading-relaxed ${!currentUser?.bio ? 'text-zinc-300 italic' : 'text-zinc-900 font-medium'}`}>
                                                        {currentUser?.bio || 'No bio written yet. Share your interests and field of study.'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Right Section: Social & Status */}
                                <div className="space-y-8">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Connect</h5>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="p-5 rounded-[1.5rem] bg-white border border-zinc-200 group hover:border-blue-200 transition-all">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Linkedin className="w-4 h-4 text-blue-600" />
                                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">LinkedIn</span>
                                                    </div>
                                                    {!isEditingProfile && currentUser?.socialLinks?.linkedin && <ExternalLink className="w-3 h-3 text-zinc-300" />}
                                                </div>
                                                {isEditingProfile ? (
                                                    <input 
                                                        type="text"
                                                        value={profileForm.socialLinks.linkedin}
                                                        onChange={(e) => setProfileForm({
                                                            ...profileForm, 
                                                            socialLinks: {...profileForm.socialLinks, linkedin: e.target.value}
                                                        })}
                                                        className="w-full p-2.5 bg-zinc-50 rounded-lg border-none text-[10px] font-bold outline-none"
                                                        placeholder="Profile URL"
                                                    />
                                                ) : (
                                                    <p className={`text-[10px] font-bold truncate ${currentUser?.socialLinks?.linkedin ? 'text-zinc-900' : 'text-zinc-300 italic'}`}>
                                                        {currentUser?.socialLinks?.linkedin || 'Not linked'}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="p-5 rounded-[1.5rem] bg-white border border-zinc-200 group hover:border-indigo-200 transition-all">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded bg-indigo-600 flex items-center justify-center text-white text-[8px] font-black">ID</div>
                                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">ORCID</span>
                                                    </div>
                                                </div>
                                                {isEditingProfile ? (
                                                    <input 
                                                        type="text"
                                                        value={profileForm.socialLinks.orcid}
                                                        onChange={(e) => setProfileForm({
                                                            ...profileForm, 
                                                            socialLinks: {...profileForm.socialLinks, orcid: e.target.value}
                                                        })}
                                                        className="w-full p-2.5 bg-zinc-50 rounded-lg border-none text-[10px] font-bold outline-none"
                                                        placeholder="ORCID iD"
                                                    />
                                                ) : (
                                                    <p className={`text-[10px] font-bold truncate ${currentUser?.socialLinks?.orcid ? 'text-zinc-900' : 'text-zinc-300 italic'}`}>
                                                        {currentUser?.socialLinks?.orcid || 'No ORCID ID'}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="p-5 rounded-[1.5rem] bg-zinc-900 text-white shadow-2xl shadow-zinc-900/20 relative overflow-hidden group">
                                                <div className="relative z-10">
                                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3">Account Health</p>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CheckCircle2 className={`w-4 h-4 ${calculateTrustScore() === 100 ? 'text-emerald-400' : 'text-blue-400'}`} />
                                                        <span className="text-xs font-black">Trust Score {calculateTrustScore()}%</span>
                                                    </div>
                                                    <p className={`text-[9px] font-bold ${isFullyVerified ? 'text-zinc-400' : 'text-zinc-500'} ml-6 italic`}>
                                                        {isFullyVerified ? 'Identity Verified' : 'Identity Unverified'}
                                                    </p>
                                                </div>
                                                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <ReviewerPortal />
                    )}

                    {activeTab === 'portal' && (
                        <ChairPortal />
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
