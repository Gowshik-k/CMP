import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, CheckCircle, ArrowRight, Filter, Globe, Cpu, FlaskConical, Stethoscope } from 'lucide-react';

const ConferenceRegistration = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Mocked conferences scheduled by admin
    const [conferences] = useState([
        {
            id: 1,
            title: 'Global AI & Machine Learning Summit 2026',
            category: 'Technology',
            date: 'March 15-17, 2026',
            location: 'Convention Center, San Jose',
            attendees: 1250,
            status: 'Open',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
            description: 'Join world-class experts to explore the latest breakthroughs in Generative AI and neural architectures.'
        },
        {
            id: 2,
            title: 'International Sustainable Energy Forum',
            category: 'Science',
            date: 'April 22-24, 2026',
            location: 'Green Tech Hub, Copenhagen',
            attendees: 840,
            status: 'Closing Soon',
            image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop',
            description: 'A global platform for discussing renewable energy solutions and climate-positive technology.'
        },
        {
            id: 3,
            title: 'Future of Healthcare Symposium',
            category: 'Healthcare',
            date: 'May 10-12, 2026',
            location: 'Medical Plaza, Zurich',
            attendees: 2100,
            status: 'Open',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop',
            description: 'Exploring the intersection of biotechnology, telemedicine, and personalized patient care.'
        },
        {
            id: 4,
            title: 'Quantum Computing Frontiers',
            category: 'Technology',
            date: 'June 05-07, 2026',
            location: 'Innovation Lab, Boston',
            attendees: 450,
            status: 'Exclusive',
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
            description: 'Advanced sessions on quantum algorithms, qubit stability, and industrial applications.'
        }
    ]);

    const [registeredIds, setRegisteredIds] = useState([]);

    const handleRegister = (id) => {
        if (!registeredIds.includes(id)) {
            setRegisteredIds([...registeredIds, id]);
        }
    };

    const categories = [
        { name: 'All', icon: Globe },
        { name: 'Technology', icon: Cpu },
        { name: 'Science', icon: FlaskConical },
        { name: 'Healthcare', icon: Stethoscope }
    ];

    const filteredConferences = conferences.filter(conf =>
        (selectedCategory === 'All' || conf.category === selectedCategory) &&
        conf.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 overflow-hidden">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Scheduled Conferences</h1>
                    <p className="text-zinc-500 mt-2 text-lg">Explore and register for upcoming events curated by our administration.</p>
                </motion.div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm w-full lg:w-96"
                >
                    <Search className="text-zinc-400 ml-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search conferences..."
                        className="w-full bg-transparent border-none outline-none py-2 text-zinc-900 placeholder-zinc-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </motion.div>
            </header>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${selectedCategory === cat.name
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-500 ring-offset-2'
                                : 'bg-white text-zinc-600 border border-zinc-100 hover:bg-zinc-50'
                            }`}
                    >
                        <cat.icon size={18} />
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Conference Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredConferences.map((conf) => (
                        <motion.div
                            key={conf.id}
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img src={conf.image} alt={conf.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg ${conf.status === 'Closing Soon' ? 'bg-amber-400/90 text-white' : 'bg-blue-500/90 text-white'
                                        }`}>
                                        {conf.status}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white/90 text-sm font-medium leading-relaxed">
                                        {conf.description}
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">{conf.category}</span>
                                    <h3 className="text-2xl font-bold text-zinc-900 mt-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        {conf.title}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center gap-3 text-zinc-500 font-medium text-sm">
                                        <div className="p-2 bg-zinc-50 rounded-lg"><Calendar size={16} /></div>
                                        {conf.date}
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-500 font-medium text-sm">
                                        <div className="p-2 bg-zinc-50 rounded-lg"><MapPin size={16} /></div>
                                        {conf.location}
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-500 font-medium text-sm">
                                        <div className="p-2 bg-zinc-50 rounded-lg"><Users size={16} /></div>
                                        {conf.attendees} Registered
                                    </div>
                                </div>

                                <div className="pt-4">
                                    {registeredIds.includes(conf.id) ? (
                                        <div className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold border border-emerald-100 animate-pulse">
                                            <CheckCircle size={20} />
                                            Registered & Confirmed
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleRegister(conf.id)}
                                            className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
                                        >
                                            Register for this Conference
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ConferenceRegistration;
