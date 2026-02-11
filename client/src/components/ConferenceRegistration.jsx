import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter, ArrowRight } from 'lucide-react';

const ConferenceRegistration = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const conferences = [
        {
            id: 1,
            title: 'International Conference on Artificial Intelligence 2026',
            date: '2026-05-15',
            location: 'New Delhi, India',
            category: 'AI & ML',
            attendees: 500,
            description: 'Explore the latest advancements in AI and machine learning with industry experts.',
            registrationDeadline: '2026-04-30',
            fee: '₹5,000'
        },
        {
            id: 2,
            title: 'Global Cybersecurity Summit',
            date: '2026-06-20',
            location: 'Bangalore, India',
            category: 'Security',
            attendees: 350,
            description: 'Join cybersecurity professionals to discuss emerging threats and solutions.',
            registrationDeadline: '2026-05-31',
            fee: '₹4,500'
        },
        {
            id: 3,
            title: 'Data Science & Analytics Conference',
            date: '2026-07-10',
            location: 'Mumbai, India',
            category: 'Data Science',
            attendees: 400,
            description: 'Discover innovative data analytics techniques and big data solutions.',
            registrationDeadline: '2026-06-25',
            fee: '₹3,800'
        }
    ];

    const filteredConferences = conferences.filter(conf =>
        (selectedFilter === 'all' || conf.category === selectedFilter) &&
        (conf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conf.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 mb-2">Available Conferences</h1>
                    <p className="text-zinc-500 font-medium">Browse and register for upcoming conferences</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm p-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search conferences..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-zinc-400" />
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="all">All Categories</option>
                            <option value="AI & ML">AI & ML</option>
                            <option value="Security">Security</option>
                            <option value="Data Science">Data Science</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Conference Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredConferences.map((conf) => (
                    <div key={conf.id} className="bg-white rounded-[32px] border border-zinc-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                        <div className="h-3 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold mb-3">
                                        {conf.category}
                                    </div>
                                    <h3 className="text-xl font-black text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {conf.title}
                                    </h3>
                                    <p className="text-sm text-zinc-600 font-medium leading-relaxed mb-4">
                                        {conf.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">
                                            {new Date(conf.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-zinc-500">Conference Date</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{conf.location}</p>
                                        <p className="text-xs text-zinc-500">Venue</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                                        <Users className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">{conf.attendees} Attendees</p>
                                        <p className="text-xs text-zinc-500">Expected Participation</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-zinc-900">
                                            {new Date(conf.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-zinc-500">Registration Deadline</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                                <div>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Registration Fee</p>
                                    <p className="text-2xl font-black text-zinc-900">{conf.fee}</p>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 group-hover:gap-3">
                                    Register Now
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredConferences.length === 0 && (
                <div className="bg-white rounded-[32px] border border-zinc-200 border-dashed p-16 text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-2">No conferences found</h3>
                    <p className="text-zinc-500 font-medium">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default ConferenceRegistration;
