import { useState } from 'react';
import { Calendar, CheckCircle, Info, X } from 'lucide-react';

const RegistrationModal = ({ isOpen, onClose, onConfirm, conference }) => {
    const [intendToSubmit, setIntendToSubmit] = useState(false);

    if (!isOpen || !conference) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-zoom-in">
                <div className="p-8">
                    <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 shadow-inner">
                        <Info className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-zinc-900 mb-2">Register for Conference</h3>
                    <p className="text-zinc-500 mb-8 leading-relaxed">
                        You are about to register for <span className="font-bold text-zinc-900">"{conference.title}"</span>. 
                        Once confirmed, you will be added as an attendee and can access event resources.
                    </p>

                    <div className="bg-zinc-50 rounded-3xl p-5 mb-8 border border-zinc-100">
                        <div className="flex items-center gap-4 mb-3">
                            <Calendar className="w-5 h-5 text-zinc-400" />
                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Event Dates</p>
                                <p className="text-sm font-bold text-zinc-900">
                                    {new Date(conference.startDate).toLocaleDateString()} - {new Date(conference.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 pt-3 border-t border-zinc-200">
                            <input 
                                type="checkbox" 
                                id="intendToSubmit"
                                checked={intendToSubmit}
                                onChange={(e) => setIntendToSubmit(e.target.checked)}
                                className="w-5 h-5 rounded-md border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="intendToSubmit" className="text-sm text-zinc-600 font-medium cursor-pointer select-none">
                                I plan to submit a paper
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => onConfirm(conference._id, intendToSubmit)}
                            className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Confirm Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationModal;
