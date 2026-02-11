import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Bookmark, MapPin, Video, Map, Calendar, ArrowUpRight } from 'lucide-react';

const Schedules = () => {
    // Mocked registered sessions for the attendee
    const [sessions] = useState([
        {
            id: 1,
            time: '09:00 AM - 10:30 AM',
            type: 'Keynote',
            title: 'The Future of AI in Research',
            speaker: 'Dr. Sarah Mitchell',
            room: 'Grand Ballroom A',
            date: 'March 15, 2026',
            status: 'Ongoing'
        },
        {
            id: 2,
            time: '11:00 AM - 12:30 PM',
            type: 'Workshop',
            title: 'Neural Network Architecture Design',
            speaker: 'Prof. James Wilson',
            room: 'Cloud Room 402',
            date: 'March 15, 2026',
            status: 'Upcoming'
        },
        {
            id: 3,
            time: '02:00 PM - 04:00 PM',
            type: 'Panel Discussion',
            title: 'Ethics in Bio-Technology',
            speaker: 'Global Ethics Committee',
            room: 'Auditorium 1',
            date: 'March 16, 2026',
            status: 'Upcoming'
        }
    ]);

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">My Conference Schedule</h1>
                    <p className="text-zinc-500 mt-2 text-lg font-medium">Your personalized timeline for registered events.</p>
                </motion.div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-zinc-600 font-bold hover:bg-zinc-50 transition-all shadow-sm">
                        <Calendar size={18} />
                        Sync to Calendar
                    </button>
                </div>
            </header>

            <div className="relative border-l-2 border-zinc-100 ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
                {sessions.map((session, index) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[41px] md:-left-[57px] top-6 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 ${session.status === 'Ongoing' ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-zinc-300'
                            }`} />

                        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${session.status === 'Ongoing' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-500'
                                            }`}>
                                            {session.type}
                                        </span>
                                        <span className="text-zinc-400 font-medium text-sm flex items-center gap-2">
                                            <Clock size={16} />
                                            {session.time}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors leading-tight">
                                        {session.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2 text-zinc-500 font-medium">
                                            <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                                <User size={16} className="group-hover:text-blue-600" />
                                            </div>
                                            {session.speaker}
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-500 font-medium">
                                            <div className="p-2 bg-zinc-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                                                <MapPin size={16} className="group-hover:text-blue-600" />
                                            </div>
                                            {session.room}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-3">
                                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
                                        <Video size={18} />
                                        {session.type === 'Keynote' ? 'Join Stream' : 'Register Link'}
                                    </button>
                                    <button className="flex items-center justify-center p-3 bg-zinc-50 text-zinc-600 rounded-2xl hover:bg-zinc-100 transition-all">
                                        <ArrowUpRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8"
            >
                <div className="space-y-2 text-center md:text-left">
                    <h4 className="text-2xl font-bold text-blue-900">Need to change your sessions?</h4>
                    <p className="text-blue-700 font-medium">Update your preferences or unregister from the conference portal.</p>
                </div>
                <button className="whitespace-nowrap px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2 ring-1 ring-blue-100">
                    <Map size={20} />
                    View Campus Map
                </button>
            </motion.div>
        </div>
    );
};

export default Schedules;
