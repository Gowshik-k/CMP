import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, FileText, CheckCircle } from 'lucide-react';

const ConferenceModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        submissionDeadline: '',
        location: '',
        mode: 'In-Person',
        themes: '',
        acceptanceNotification: '',
        registrationFees: {
            ugPgStudents: 0,
            facultyResearchScholars: 0,
            externalOnlinePresentation: 0,
            industryPersonnel: 0
        },
        contactEmail: '',
        contactPhone: '',
        convenors: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
                submissionDeadline: initialData.submissionDeadline ? new Date(initialData.submissionDeadline).toISOString().split('T')[0] : '',
                location: initialData.location || '',
                mode: initialData.mode || 'In-Person',
                themes: initialData.themes || '',
                acceptanceNotification: initialData.acceptanceNotification ? new Date(initialData.acceptanceNotification).toISOString().split('T')[0] : '',
                registrationFees: initialData.registrationFees || {
                    ugPgStudents: 0,
                    facultyResearchScholars: 0,
                    externalOnlinePresentation: 0,
                    industryPersonnel: 0
                },
                contactEmail: initialData.contactEmail || '',
                contactPhone: initialData.contactPhone || '',
                convenors: initialData.convenors || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                submissionDeadline: '',
                location: '',
                mode: 'In-Person',
                themes: '',
                acceptanceNotification: '',
                registrationFees: {
                    ugPgStudents: 0,
                    facultyResearchScholars: 0,
                    externalOnlinePresentation: 0,
                    industryPersonnel: 0
                },
                contactEmail: '',
                contactPhone: '',
                convenors: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value === '' ? 0 : Number(value)
                }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic Validation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(formData.startDate);

        if (start < today) {
            alert('Start Date cannot be in the past.');
            return;
        }

        if (new Date(formData.endDate) < start) {
            alert('End Date must be after Start Date.');
            return;
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl border border-white overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-zinc-900">{initialData ? 'Edit Conference' : 'Create Conference'}</h4>
                            <p className="text-xs text-zinc-500 font-medium tracking-tight">
                                {initialData ? 'Update conference details' : 'Schedule a new conference event'}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Conference Title</label>
                            <div className="relative group">
                                <FileText className="absolute left-3 top-3 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                    placeholder="e.g. International Conference on AI"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all resize-none"
                                placeholder="Brief description of the conference..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Submission Deadline</label>
                                <input
                                    type="date"
                                    name="submissionDeadline"
                                    value={formData.submissionDeadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                        placeholder="e.g. University Hall A"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Event Mode</label>
                                <select
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                >
                                    <option value="In-Person">In-Person</option>
                                    <option value="Online">Online</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Acceptance Notification</label>
                                <input
                                    type="date"
                                    name="acceptanceNotification"
                                    value={formData.acceptanceNotification}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Conference Themes</label>
                            <textarea
                                name="themes"
                                value={formData.themes}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all resize-none"
                                placeholder="Innovations in Civil, Computer Science, etc..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block border-b border-zinc-100 pb-2 italic">Registration Fees (in Rs.)</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-1">UG/PG Students</label>
                                    <input
                                        type="number"
                                        name="registrationFees.ugPgStudents"
                                        value={formData.registrationFees.ugPgStudents}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-blue-500 focus:bg-white text-zinc-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-1">Faculty/Research Scholars</label>
                                    <input
                                        type="number"
                                        name="registrationFees.facultyResearchScholars"
                                        value={formData.registrationFees.facultyResearchScholars}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-blue-500 focus:bg-white text-zinc-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-1">External/Online Presentation</label>
                                    <input
                                        type="number"
                                        name="registrationFees.externalOnlinePresentation"
                                        value={formData.registrationFees.externalOnlinePresentation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-blue-500 focus:bg-white text-zinc-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight ml-1">Industry Personnel</label>
                                    <input
                                        type="number"
                                        name="registrationFees.industryPersonnel"
                                        value={formData.registrationFees.industryPersonnel}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg outline-none focus:border-blue-500 focus:bg-white text-zinc-900 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Contact Email</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                    placeholder="e.g. contact@conference.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Contact Phone</label>
                                <input
                                    type="text"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all"
                                    placeholder="e.g. +91 9790038605"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Convenors</label>
                            <textarea
                                name="convenors"
                                value={formData.convenors}
                                onChange={handleChange}
                                rows="2"
                                className="w-full p-4 bg-zinc-50 border-2 border-zinc-100 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white text-zinc-900 font-medium transition-all resize-none"
                                placeholder="Dr. M. Sowrirajan, Dr. P. Magudeaswaran..."
                            />
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-end gap-3 bg-zinc-50 shrink-0">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-bold text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-700 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-sm"
                        >
                            {initialData ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Update Conference
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Create Conference
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConferenceModal;
