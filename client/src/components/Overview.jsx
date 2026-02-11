import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Award, Image as ImageIcon, ArrowRight } from 'lucide-react';

const Overview = () => {
    const [stats, setStats] = useState({
        registeredConferences: 4,
        upcomingSessions: 12,
        certificatesEarned: 2
    });

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { name: 'Attendee', username: 'Attendee' };

    const conferencePhotos = [
        { id: 1, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop', title: 'Tech Summit 2025' },
        { id: 2, url: 'https://images.unsplash.com/photo-1591115765373-520b7a3f7294?w=800&auto=format&fit=crop', title: 'Global AI Expo' },
        { id: 3, url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop', title: 'Science Symposium' },
        { id: 4, url: 'https://images.unsplash.com/photo-1475721027187-402ad2959e3e?w=800&auto=format&fit=crop', title: 'Design Week' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
                        Welcome back, <span className="text-blue-600">{user.name || user.username}</span>!
                    </h1>
                    <p className="text-zinc-500 mt-2 text-lg">Your conference journey at a glance.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Explore Conferences <ArrowRight size={20} />
                </button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Registered', value: stats.registeredConferences, icon: Calendar, color: 'blue' },
                    { label: 'Upcoming Sessions', value: stats.upcomingSessions, icon: Users, color: 'purple' },
                    { label: 'Certificates', value: stats.certificatesEarned, icon: Award, color: 'emerald' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-shadow group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className={`p-4 bg-${stat.color}-100 text-${stat.color}-600 rounded-2xl`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-zinc-500 font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-zinc-900 mt-1">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-zinc-900">Recent Activity</h3>
                        <span className="text-blue-600 font-semibold cursor-pointer hover:underline text-sm uppercase tracking-wider">View All</span>
                    </div>
                    <ul className="space-y-6">
                        {[
                            { title: 'Registered for "Tech summit 2025"', time: '2 hours ago', icon: '✨' },
                            { title: 'Downloaded Certificate for "AI Ethics"', time: 'Yesterday', icon: '📥' },
                            { title: 'New material added to "Design Systems"', time: '2 days ago', icon: '📚' }
                        ].map((activity, idx) => (
                            <li key={idx} className="flex gap-4 group cursor-pointer">
                                <div className="w-12 h-12 flex-shrink-0 bg-zinc-50 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                    {activity.icon}
                                </div>
                                <div>
                                    <p className="text-zinc-900 font-semibold group-hover:text-blue-600 transition-colors">{activity.title}</p>
                                    <p className="text-zinc-500 text-sm mt-1 uppercase tracking-tight font-medium">{activity.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Photo Gallery Area */}
                <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                                <ImageIcon size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900">Conference Moments</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {conferencePhotos.map((photo) => (
                            <div key={photo.id} className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-md">
                                <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-sm font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {photo.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-500 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2">
                        Upload Your Moments
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Overview;
