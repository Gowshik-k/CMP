import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCog, Trash2, ShieldCheck, Mail, Calendar, Search } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                const res = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: { 'auth-token': token }
                });
                setUsers(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users:', err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.patch(`http://localhost:5000/api/admin/users/${userId}/role`, 
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
            await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
                headers: { 'auth-token': token }
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const roles = ['Attendee', 'Author', 'Reviewer', 'Chair', 'Admin'];

    return (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-zinc-900">Registered Users</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-50/50 text-zinc-500 text-xs font-bold uppercase tracking-widest border-b border-zinc-100">
                            <th className="px-8 py-4">User</th>
                            <th className="px-8 py-4">Joined Date</th>
                            <th className="px-8 py-4">Current Role</th>
                            <th className="px-12 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 text-sm">
                                            {user.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-zinc-900">{user.username}</div>
                                            <div className="text-zinc-500 text-xs flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <select 
                                        className={`text-sm font-bold px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            user.role === 'Admin' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                                        }`}
                                        value={user.role}
                                        onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                    >
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button 
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="p-20 text-center text-zinc-400">
                    <UserCog className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No users found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
