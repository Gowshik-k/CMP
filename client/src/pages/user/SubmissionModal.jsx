import { useState } from 'react';
import { FileText, X, CheckCircle, Upload, Info } from 'lucide-react';

const SubmissionModal = ({ isOpen, onClose, onSubmit, conference }) => {
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        filePath: '' // For now just a placeholder
    });

    if (!isOpen || !conference) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, conferenceId: conference._id });
        setFormData({ title: '', abstract: '', filePath: '' });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-zinc-900">Submit Paper</h4>
                            <p className="text-xs text-zinc-500 font-medium tracking-tight">For: {conference.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-xl transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <form id="submission-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Paper Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-5 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-indigo-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                placeholder="Enter the full title of your paper"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Abstract</label>
                            <textarea
                                required
                                rows="5"
                                value={formData.abstract}
                                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                                className="w-full p-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl outline-none focus:border-indigo-500/50 focus:bg-white text-zinc-900 font-medium transition-all resize-none"
                                placeholder="Briefly summarize your research..."
                            />
                        </div>

                        <div className="p-8 border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50 flex flex-col items-center justify-center text-center group hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer">
                            <Upload className="w-10 h-10 text-zinc-300 group-hover:text-indigo-400 mb-4 transition-all" />
                            <p className="text-sm font-bold text-zinc-900 mb-1">Upload PDF Document</p>
                            <p className="text-xs text-zinc-500">Max file size 10MB. Only .pdf accepted.</p>
                            <input type="file" className="hidden" accept=".pdf" />
                        </div>
                    </form>
                </div>

                <div className="px-8 py-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50">
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-[10px] font-bold">
                        <Info className="w-3.5 h-3.5" />
                        Double-blind review in effect
                    </div>
                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-200/50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            form="submission-form"
                            type="submit"
                            className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Submit Paper
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionModal;
