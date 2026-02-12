import { useState, useEffect } from 'react';
import { 
    BookOpen, 
    FileText, 
    CheckCircle2, 
    Clock, 
    ExternalLink,
    Star,
    MessageSquare,
    Send,
    Search,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { reviewerAPI } from '../../api';

const ReviewerPortal = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Review Form State
    const [score, setScore] = useState(3);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchAssignedReviews();
    }, []);

    const fetchAssignedReviews = async () => {
        try {
            setLoading(true);
            const res = await reviewerAPI.getAssignedReviews();
            setReviews(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            setSubmitLoading(true);
            await reviewerAPI.submitReview(selectedReview._id, { score, feedback });
            
            // Update local state
            setReviews(prev => prev.map(r => 
                r._id === selectedReview._id 
                    ? { ...r, status: 'Completed', score, feedback } 
                    : r
            ));
            
            setSelectedReview(null);
            setFeedback('');
            setScore(3);
            setSubmitLoading(false);
        } catch (err) {
            console.error('Error submitting review:', err);
            alert(err.response?.data?.message || 'Error submitting review');
            setSubmitLoading(false);
        }
    };

    const filteredReviews = reviews.filter(r => 
        r.submission?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-zinc-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">Accessing Reviewer Vault...</p>
            </div>
        );
    }

    if (selectedReview) {
        return (
            <div className="flex-1 flex flex-col gap-8 animate-fade-in pb-12 max-w-4xl mx-auto">
                <button 
                    onClick={() => setSelectedReview(null)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group self-start"
                >
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Assignments</span>
                </button>

                <div className="bg-white p-10 rounded-[3rem] border border-zinc-200 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                    
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/10">
                                <FileText className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">{selectedReview.submission.title}</h2>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
                                    {selectedReview.submission.conference?.title}
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-50 p-6 rounded-2xl mb-8 border border-zinc-100">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Abstract Overview</p>
                            <p className="text-sm font-medium text-zinc-600 leading-relaxed italic">
                                {selectedReview.submission.abstract || "No abstract provided."}
                            </p>
                            <div className="mt-6">
                                <a 
                                    href={selectedReview.submission.filePath} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/10"
                                >
                                    <ExternalLink className="w-4 h-4" /> View Full Manuscript
                                </a>
                            </div>
                        </div>

                        {selectedReview.status === 'Completed' ? (
                            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
                                <div className="flex items-center gap-3 mb-4 text-emerald-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Review Submitted</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-8 mt-6">
                                    <div>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Score Given</p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={`w-4 h-4 ${s <= selectedReview.score ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Date Finalized</p>
                                        <p className="text-[10px] font-bold text-zinc-900">{new Date(selectedReview.completedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-span-full">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Your Feedback</p>
                                        <p className="text-xs font-bold text-zinc-700 leading-relaxed">{selectedReview.feedback}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitReview} className="space-y-8">
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
                                        Quality Assessment Score
                                    </label>
                                    <div className="flex gap-4">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setScore(s)}
                                                className={`w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center text-xl font-black ${
                                                    score === s 
                                                        ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-xl shadow-blue-500/20' 
                                                        : 'bg-white border-zinc-100 text-zinc-300 hover:border-blue-200 hover:text-blue-400'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2 px-1">
                                        <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Poor</span>
                                        <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Exceptional</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
                                        Critique & Recommendations
                                    </label>
                                    <textarea
                                        className="w-full p-6 bg-zinc-50 border border-zinc-100 rounded-3xl text-sm font-medium text-zinc-600 min-h-[200px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-zinc-300"
                                        placeholder="Summarize your findings, strengths, and weaknesses of this paper..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full py-5 bg-zinc-900 text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50"
                                >
                                    {submitLoading ? 'Finalizing...' : (
                                        <>
                                            Submit Definitive Review <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col gap-8 animate-fade-in pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Reviewer Portal</p>
                    <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">Paper Assignments</h2>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredReviews.map(review => (
                    <div 
                        key={review._id} 
                        onClick={() => setSelectedReview(review)}
                        className="bg-white p-2 border border-zinc-200 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-500/5 group cursor-pointer transition-all duration-300"
                    >
                        <div className="flex items-center gap-6 p-6">
                            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all shrink-0">
                                <FileText className="w-8 h-8" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="text-lg font-black text-zinc-900 uppercase tracking-tight truncate">
                                        {review.submission?.title}
                                    </h4>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        review.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                        {review.status}
                                    </span>
                                </div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                    {review.submission?.conference?.title} • Assigned {new Date(review.assignedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-6 px-10 border-l border-zinc-100">
                                {review.status === 'Completed' ? (
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase mb-1">Your Score</p>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <span className="text-lg font-black">{review.score}</span>
                                            <Star className="w-4 h-4 fill-amber-500" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase mb-1">Pending</p>
                                        <Clock className="w-6 h-6 text-blue-400 mx-auto" />
                                    </div>
                                )}
                                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredReviews.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-32 bg-white rounded-[3rem] border border-zinc-200 border-dashed">
                        <BookOpen className="w-20 h-20 text-zinc-50 mb-6" />
                        <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Assignment Free</h3>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2 text-center max-w-xs">
                            You're all caught up! No papers currently require your expert evaluation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewerPortal;
