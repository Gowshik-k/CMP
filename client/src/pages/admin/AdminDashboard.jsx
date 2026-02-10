import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, Calendar, Settings, LogOut, ChevronRight, TrendingUp, Shield } from 'lucide-react';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalUsers: 0, roleDistribution: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('auth-token');
<<<<<<< HEAD
                const res = await axios.get('http://localhost:5000/api/admin/stats', {
=======
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                    headers: { 'auth-token': token }
                });
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'conferences', label: 'Conferences', icon: Calendar },
        { id: 'submissions', label: 'Submissions', icon: FileText },
        { id: 'settings', label: 'Site Settings', icon: Settings },
    ];

    return (
<<<<<<< HEAD
        <div className="flex h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 text-white flex flex-col shadow-xl">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">A</div>
                        <span className="font-bold text-xl tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
=======
        <div className="flex h-screen bg-[#f8fafc] pt-16">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 text-white flex flex-col shadow-xl">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">A</div>
                        <span className="font-bold text-lg tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                    </div>
                    
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
<<<<<<< HEAD
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
=======
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                                    activeTab === item.id 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                            >
<<<<<<< HEAD
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-blue-400'}`} />
                                <span className="font-medium">{item.label}</span>
                                {activeTab === item.id && <ChevronRight className="ml-auto w-4 h-4 opacity-70" />}
=======
                                <item.icon className={`w-4.5 h-4.5 ${activeTab === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-blue-400'}`} />
                                <span className="font-medium text-sm">{item.label}</span>
                                {activeTab === item.id && <ChevronRight className="ml-auto w-3.5 h-3.5 opacity-70" />}
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-zinc-800">
                    <button 
                        onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
<<<<<<< HEAD
            <main className="flex-1 overflow-y-auto p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                            {sidebarItems.find(i => i.id === activeTab)?.label}
                        </h1>
                        <p className="text-zinc-500 mt-1">Manage your university conference system from here.</p>
=======
            <main className="flex-1 flex flex-col overflow-hidden p-6 md:p-8">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            {sidebarItems.find(i => i.id === activeTab)?.label}
                        </h1>
                        <p className="text-zinc-500 text-xs mt-0.5">Manage your university conference system from here.</p>
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-full border border-zinc-200 shadow-sm relative cursor-pointer hover:bg-zinc-50 transition-colors">
                            <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-2 right-2 border-2 border-white"></div>
                            <Users className="w-5 h-5 text-zinc-600" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center font-bold text-zinc-600">
                            AD
                        </div>
                    </div>
                </header>

                {activeTab === 'overview' && (
<<<<<<< HEAD
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
=======
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6 animate-fade-in-up">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                            <StatCard 
                                label="Total Users" 
                                value={stats.totalUsers} 
                                change="+12%" 
                                icon={Users}
                                color="blue"
                            />
                            <StatCard 
<<<<<<< HEAD
                                label="Active Conferences" 
=======
                                label="Conferences" 
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                                value="8" 
                                change="+2" 
                                icon={Calendar}
                                color="emerald"
                            />
                            <StatCard 
                                label="Submissions" 
                                value="124" 
                                change="+24" 
                                icon={FileText}
                                color="amber"
                            />
                        </div>

                        {/* Distribution and Logs placeholder */}
<<<<<<< HEAD
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                                <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-500" />
                                    Role Distribution
                                </h3>
                                <div className="space-y-4">
                                    {stats.roleDistribution.map((role) => (
                                        <div key={role._id} className="flex items-center gap-4">
                                            <div className="w-24 text-sm font-medium text-zinc-600">{role._id}</div>
                                            <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
=======
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                                <h3 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2">
                                    <Shield className="w-4.5 h-4.5 text-blue-500" />
                                    Role Distribution
                                </h3>
                                <div className="space-y-3.5">
                                    {stats.roleDistribution.map((role) => (
                                        <div key={role._id} className="flex items-center gap-4">
                                            <div className="w-20 text-xs font-medium text-zinc-600">{role._id}</div>
                                            <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                                                <div 
                                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${(role.count / stats.totalUsers) * 100}%` }}
                                                ></div>
                                            </div>
<<<<<<< HEAD
                                            <div className="w-8 text-sm font-bold text-zinc-900 text-right">{role.count}</div>
=======
                                            <div className="w-6 text-xs font-bold text-zinc-900 text-right">{role.count}</div>
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
<<<<<<< HEAD
                            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 mb-2">System Performance</h3>
                                <p className="text-zinc-500 text-sm max-w-xs mb-6">
                                    Server response time is optimal. All background jobs are running as expected.
                                </p>
                                <button className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors">
                                    View Detailed Logs
=======
                            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-zinc-900 mb-1">System Health</h3>
                                <p className="text-zinc-500 text-xs max-w-[240px] mb-4">
                                    Server response time: 24ms. Background worker: Active.
                                </p>
                                <button className="px-5 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors">
                                    System Status
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && <UserManagement />}
                
                {['conferences', 'submissions', 'settings'].includes(activeTab) && (
                   <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-zinc-200 border-dashed">
                       <p className="text-zinc-400 font-medium">This module is coming soon...</p>
                   </div>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ label, value, change, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
<<<<<<< HEAD
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
=======
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${color === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
                    {change}
                </span>
            </div>
            <div>
<<<<<<< HEAD
                <p className="text-zinc-500 font-medium mb-1">{label}</p>
                <h4 className="text-4xl font-extrabold text-zinc-900">{value}</h4>
=======
                <p className="text-zinc-500 text-xs font-semibold mb-0.5 uppercase tracking-wider">{label}</p>
                <h4 className="text-3xl font-black text-zinc-900">{value}</h4>
>>>>>>> 724ce70c19f3421f7fead5903106498fa868c629
            </div>
        </div>
    );
};

export default AdminDashboard;
