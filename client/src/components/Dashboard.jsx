import React from 'react';
import { LayoutDashboard, Calendar, FileCheck, LogOut, Settings, Bell, Search, User as UserIcon, Home as HomeIcon } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const getUserInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const menuItems = [
    { path: '/', label: 'Back to Site', icon: HomeIcon, end: true },
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/dashboard/registration', label: 'Conferences', icon: Calendar },
    { path: '/dashboard/schedules', label: 'My Schedules', icon: Calendar },
    { path: '/dashboard/certificates', label: 'Certificates', icon: FileCheck },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans">
      {/* Premium Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white border-r border-zinc-100 flex flex-col z-20 shadow-xl shadow-zinc-100/50"
      >
        <div className="p-10">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-black text-xl">U</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tighter">University<span className="text-blue-600">Conf</span></h2>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Attendee Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}
              `}
            >
              <item.icon size={22} className={({ isActive }) => isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              <span className="tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto space-y-2 border-t border-zinc-50">
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all group">
            <Settings size={22} className="group-hover:rotate-45 transition-transform" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Modern Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-zinc-50 px-10 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-4 bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100 w-96 group focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={18} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search everything..."
              className="bg-transparent border-none outline-none text-sm font-medium text-zinc-900 placeholder-zinc-400 w-full"
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell size={22} className="text-zinc-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">2</span>
            </div>

            <div className="h-10 w-[1px] bg-zinc-100" />

            <div className="flex items-center gap-4 group cursor-pointer bg-white pr-2 rounded-2xl hover:bg-zinc-50 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-zinc-900 leading-none">{user?.name || 'Attendee'}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Verified Member</p>
              </div>
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-zinc-200 group-hover:scale-105 transition-transform overflow-hidden border-2 border-white">
                {user?.image ? (
                  <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getUserInitials(user?.name)
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFDFD]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
