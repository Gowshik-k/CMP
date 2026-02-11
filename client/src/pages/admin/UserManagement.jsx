import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { UserCog, Trash2, ShieldCheck, Mail, Calendar, Search, UserPlus, X, ChevronDown, Check, Shield, User as UserIcon, Award, Briefcase, Phone, Lock } from 'lucide-react';
import { adminAPI } from '../../api';

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
        phoneNumber: '',
        role: 'Attendee'
    });
    const [formError, setFormError] = useState('');

    const roles = ['Attendee', 'Author', 'Reviewer', 'Chair', 'Admin'];

    const fetchUsers = async () => {
        try {
            const res = await adminAPI.getAllUsers();
            setUsers(res.data.data || []);
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
            const res = await adminAPI.updateUserRole(userId, newRole);
            setUsers(users.map(u => u._id === userId ? res.data.data : u));
            console.log(`Role updated for user ${userId} to ${newRole}`);
        } catch (err) {
            console.error('Role update failed:', err);
            setFormError('Failed to update user role. Please try again.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await adminAPI.createUser(newUser);
            setShowAddModal(false);
            setNewUser({ username: '', email: '', password: '', phoneNumber: '', role: 'Attendee' });
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
                            <tr className="bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-widest border-b border-zinc-100">
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl border border-white overflow-hidden animate-zoom-in flex flex-col">
                        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-zinc-900">Add New User</h4>
                                    <p className="text-xs text-zinc-500 font-medium tracking-tight">Enter details to create a new account</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => { setShowAddModal(false); setFormError(''); }}
                                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleAddUser} className="space-y-4">
                                {formError && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
                                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                        {formError}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Username</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400"
                                                placeholder="Enter username"
                                                value={newUser.username}
                                                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400"
                                                placeholder="name@university.edu"
                                                value={newUser.email}
                                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Initial Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                type="password"
                                                required
                                                minLength="6"
                                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400"
                                                placeholder="••••••••"
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                            <input 
                                                type="tel"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-400"
                                                placeholder="+1 234 567 890"
                                                value={newUser.phoneNumber}
                                                onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Assign System Role</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {roles.map((r) => {
                                            // Helper to get role icon/color
                                            const roleConfigs = {
                                                'Admin': { icon: Shield, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', active: 'ring-rose-500/30' },
                                                'Chair': { icon: Award, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', active: 'ring-amber-500/30' },
                                                'Reviewer': { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', active: 'ring-indigo-500/30' },
                                                'Author': { icon: UserCog, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', active: 'ring-emerald-500/30' },
                                                'Attendee': { icon: UserIcon, color: 'text-zinc-600', bg: 'bg-zinc-50', border: 'border-zinc-200', active: 'ring-zinc-500/30' },
                                            };
                                            const config = roleConfigs[r] || roleConfigs['Attendee'];
                                            const RIcon = config.icon;
                                            const isSelected = newUser.role === r;

                                            return (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => setNewUser({...newUser, role: r})}
                                                    className={`relative p-3 rounded-xl border text-left transition-all duration-200 group flex flex-col items-start gap-2 ${
                                                        isSelected 
                                                        ? `bg-white ${config.border} ring-2 ${config.active} shadow-lg scale-[1.02]` 
                                                        : 'bg-white border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50'
                                                    }`}
                                                >
                                                    <div className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
                                                        <RIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold text-xs ${isSelected ? 'text-zinc-900' : 'text-zinc-600'}`}>{r}</div>
                                                        <div className="text-[9px] text-zinc-400 font-medium leading-tight">Access details</div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 text-blue-600">
                                                            <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                                                <Check className="w-2.5 h-2.5" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-zinc-100 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-3 rounded-xl text-sm font-bold text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Create User Account</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-component for a stylish role dropdown
const RoleDropdown = ({ currentRole, roles, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);

    useLayoutEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 220; // Slightly reduced estimate to be safe

            // Only flip upwards if there is insufficient space below
            if (spaceBelow < dropdownHeight) {
                setOpenUpwards(true);
            } else {
                setOpenUpwards(false);
            }
        }
    }, [isOpen]);

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
        <div className="relative" ref={buttonRef}>
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
                    <div 
                        ref={dropdownRef}
                        className={`absolute right-0 w-48 bg-white rounded-2xl shadow-xl border border-zinc-100 z-50 overflow-hidden py-2 animate-zoom-in ${
                            openUpwards 
                                ? 'bottom-full mb-2 origin-bottom' 
                                : 'top-full mt-2 origin-top'
                        }`}
                    >
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
