import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award, FileText, ExternalLink, ShieldCheck, Printer, Share2, FileDown } from 'lucide-react';

const Certificates = () => {
    const [selectedCert, setSelectedCert] = useState(null);

    // Mocked earned certificates
    const [certificates] = useState([
        {
            id: 1,
            title: 'Advanced AI Research Certification',
            conference: 'Global AI Summit 2025',
            date: 'December 12, 2025',
            serial: 'CERT-2025-001-AI',
            image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=800&auto=format&fit=crop',
            issuer: 'The AI Research Council'
        },
        {
            id: 2,
            title: 'Digital Humanities Excellence',
            conference: 'Digital Humanities 2025',
            date: 'November 20, 2025',
            serial: 'CERT-2025-042-DH',
            image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop',
            issuer: 'Global Humanities Institute'
        }
    ]);

    const handleDownload = (cert, format) => {
        alert(`Initializing ${format} download for: ${cert.title}`);
        // In a real app, this would trigger a backend download or use a library like jsPDF
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Certificates & Awards</h1>
                    <p className="text-zinc-500 mt-2 text-lg font-medium">Verified recognition of your professional achievements.</p>
                </motion.div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
                        <Share2 size={18} />
                        Share Profile
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <AnimatePresence>
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[3rem] border border-zinc-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-50 border-b border-zinc-100 p-8 flex items-center justify-center">
                                {/* Professional Certificate Mockup Preview */}
                                <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: `url(${cert.image})`, backgroundSize: 'cover' }} />

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="relative z-10 w-full h-full bg-white border-8 border-double border-zinc-200 shadow-xl p-8 flex flex-col items-center justify-center text-center space-y-4 rounded-xl"
                                >
                                    <Award size={64} className="text-blue-600 mb-2" />
                                    <h2 className="text-2xl font-serif font-bold text-zinc-800 uppercase tracking-widest">{cert.title}</h2>
                                    <div className="w-24 h-px bg-blue-600" />
                                    <p className="text-zinc-500 font-medium italic">Awarded to</p>
                                    <p className="text-2xl font-bold text-zinc-900 border-b-2 border-zinc-100 px-8 pb-2">Dummy Attendee</p>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-4">SERIAL: {cert.serial}</p>
                                </motion.div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-zinc-900 leading-tight">{cert.conference}</h3>
                                        <p className="text-zinc-500 font-medium">Issued on {cert.date} by {cert.issuer}</p>
                                    </div>
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                        <ShieldCheck size={28} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleDownload(cert, 'PDF')}
                                        className="flex items-center justify-center gap-3 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all group/btn shadow-lg hover:shadow-blue-200"
                                    >
                                        <FileDown size={20} className="group-hover/btn:translate-y-1 transition-transform" />
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={() => handleDownload(cert, 'DOCS')}
                                        className="flex items-center justify-center gap-3 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
                                    >
                                        <FileText size={20} />
                                        Download DOCS
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-6 pt-2 border-t border-zinc-100">
                                    <button className="text-zinc-400 hover:text-blue-600 font-bold text-sm flex items-center gap-2 transition-colors">
                                        <Printer size={16} /> Print Copy
                                    </button>
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                                    <button className="text-zinc-400 hover:text-blue-600 font-bold text-sm flex items-center gap-2 transition-colors">
                                        <ExternalLink size={16} /> Verify Credentials
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-zinc-50 p-8 rounded-[3rem] text-center border border-zinc-100"
            >
                <p className="text-zinc-500 font-medium">Are we missing a certificate? <span className="text-blue-600 cursor-pointer hover:underline">Contact the administration office</span> for manual verification.</p>
            </motion.div>
        </div>
    );
};

export default Certificates;
