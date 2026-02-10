import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCog, Trash2, ShieldCheck, Mail, Calendar, Search, UserPlus, X, ChevronDown, Check, Shield, User as UserIcon, Award, Briefcase } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    
    // New User Form State
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'Attendee'
    });
    const [formError, setFormError] = useState('');

    const roles = ['Attendee', 'Author', 'Reviewer', 'Chair', 'Admin'];

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
                headers: { 'auth-token': token }
            });
            setUsers(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.patch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`, 
                { role: newRole },
                { headers: { 'auth-token': token } }
            );
            setUsers(users.map(u => u._id === userId ? res.data : u));
        } catch (err) {
            alert('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('auth-token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
                headers: { 'auth-token': token }
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            const token = localStorage.getItem('auth-token');
            await axios.post(`${import.meta.env.VITE_API_URL}/admin/users`, newUser, {
                headers: { 'auth-token': token }
            });
            setShowAddModal(false);
            setNewUser({ username: '', email: '', password: '', role: 'Attendee' });
            fetchUsers();
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to add user');
        }
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 animate-fade-in-up">
            {/* Header Actions */}
            <div className="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                <div>
                    <h3 className="text-xl font-bold text-zinc-900">User Directory</h3>
                    <p className="text-sm text-zinc-500">Manage access and permissions for all platform users.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-zinc-50/50 text-zinc-500 text-xs font-bold uppercase tracking-widest border-b border-zinc-100">
                                <th className="px-8 py-4">User Details</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Role Access</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center font-bold text-zinc-600 text-base shadow-inner">
                                                {user.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-zinc-900 leading-tight">{user.username}</div>
                                                <div className="text-zinc-500 text-xs mt-1 flex items-center gap-1.5 font-medium">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-zinc-900 font-medium">Active</span>
                                            <div className="text-zinc-400 text-[10px] flex items-center gap-1 uppercase tracking-tighter">
                                                <Calendar className="w-3 h-3" />
                                                Since {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="relative inline-block text-left">
                                            <RoleDropdown 
                                                currentRole={user.role} 
                                                roles={roles} 
                                                onSelect={(newRole) => handleRoleUpdate(user._id, newRole)}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete Account"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && !loading && (
                    <div className="p-32 text-center text-zinc-400">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 opacity-20" />
                        </div>
                        <h4 className="text-lg font-bold text-zinc-900 mb-1">No matches found</h4>
                        <p className="text-sm">Try adjusting your search terms or filters.</p>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-white overflow-hidden animate-zoom-in">
                        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-zinc-900">Add New User</h4>
                                    <p className="text-xs text-zinc-500 font-medium tracking-tight">Create a manual user entry</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setShowAddModal(false); setFormError(''); }}
                                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="p-8 space-y-5">
                            {formError && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Username</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="Enter username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Email Address</label>
                                <input 
                                    type="email"
                                    required
                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="name@university.edu"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Initial Password</label>
                                <input 
                                    type="password"
                                    required
                                    minLength="6"
                                    className="w-full px-5 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Assigned Role</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {roles.map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setNewUser({...newUser, role: r})}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                                newUser.role === r 
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' 
                                                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-zinc-600 border border-zinc-200 hover:bg-zinc-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                                >
                                    Confirm Addition
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-component for a stylish role dropdown
const RoleDropdown = ({ currentRole, roles, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getRoleConfig = (role) => {
        const configs = {
            'Admin': { icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
            'Chair': { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            'Reviewer': { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
            'Author': { icon: UserCog, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            'Attendee': { icon: UserIcon, color: 'text-zinc-600', bg: 'bg-zinc-100', border: 'border-zinc-200' },
        };
        return configs[role] || configs['Attendee'];
    };

    const config = getRoleConfig(currentRole);
    const Icon = config.icon;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-sm font-bold transition-all ${config.bg} ${config.color} ${config.border} hover:shadow-sm`}
            >
                <Icon className="w-3.5 h-3.5" />
                <span>{currentRole}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 z-50 overflow-hidden py-2 animate-zoom-in origin-bottom">
                        {roles.map((r) => {
                            const rConfig = getRoleConfig(r);
                            const RIcon = rConfig.icon;
                            return (
                                <button
                                    key={r}
                                    onClick={() => { onSelect(r); setIsOpen(false); }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all ${
                                        currentRole === r ? 'bg-zinc-50 text-blue-600' : 'text-zinc-600 hover:bg-zinc-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${rConfig.bg} ${rConfig.color}`}>
                                            <RIcon className="w-3.5 h-3.5" />
                                        </div>
                                        {r}
                                    </div>
                                    {currentRole === r && <Check className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserManagement;
