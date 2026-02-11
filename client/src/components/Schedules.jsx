import React from 'react';
import { Calendar, Clock, MapPin, Video, Users } from 'lucide-react';

const Schedules = () => {
    const schedules = [
        {
            id: 1,
            conference: 'International Conference on AI 2026',
            session: 'Keynote: Future of Machine Learning',
            date: '2026-05-15',
            time: '09:00 AM - 10:30 AM',
            location: 'Main Auditorium',
            speaker: 'Dr. Sarah Johnson',
            type: 'keynote',
            isVirtual: false
        },
        {
            id: 2,
            conference: 'International Conference on AI 2026',
            session: 'Workshop: Deep Learning Fundamentals',
            date: '2026-05-15',
            time: '11:00 AM - 01:00 PM',
            location: 'Hall B',
            speaker: 'Prof. Michael Chen',
            type: 'workshop',
            isVirtual: false
        },
        {
            id: 3,
            conference: 'Global Cybersecurity Summit',
            session: 'Panel Discussion: Emerging Threats',
            date: '2026-06-20',
            time: '02:00 PM - 03:30 PM',
            location: 'Virtual',
            speaker: 'Multiple Speakers',
            type: 'panel',
            isVirtual: true
        }
    ];

    const getTypeColor = (type) => {
        const colors = {
            keynote: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            workshop: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            panel: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
        };
        return colors[type] || colors.keynote;
    };

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-black text-zinc-900 mb-2">My Schedules</h1>
                <p className="text-zinc-500 font-medium">View your upcoming conference sessions and events</p>
            </div>

            <div className="space-y-4">
                {schedules.map((schedule) => {
                    const typeColor = getTypeColor(schedule.type);
                    return (
                        <div key={schedule.id} className="bg-white rounded-[32px] border border-zinc-200 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                            <div className="flex">
                                <div className="w-2 bg-gradient-to-b from-blue-600 to-blue-400"></div>
                                <div className="flex-1 p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-xl border text-xs font-bold ${typeColor.bg} ${typeColor.text} ${typeColor.border} uppercase`}>
                                                    {schedule.type}
                                                </span>
                                                {schedule.isVirtual && (
                                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                                                        <Video className="w-3 h-3" />
                                                        Virtual
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-black text-zinc-900 mb-1">{schedule.session}</h3>
                                            <p className="text-sm text-zinc-600 font-medium">{schedule.conference}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Date</p>
                                                <p className="text-sm font-bold text-zinc-900">
                                                    {new Date(schedule.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Time</p>
                                                <p className="text-sm font-bold text-zinc-900">{schedule.time.split(' - ')[0]}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Location</p>
                                                <p className="text-sm font-bold text-zinc-900">{schedule.location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                                                <Users className="w-5 h-5 text-rose-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Speaker</p>
                                                <p className="text-sm font-bold text-zinc-900">{schedule.speaker}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Schedules;
