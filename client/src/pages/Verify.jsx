import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, MessageSquare, Mail, Phone, CheckCircle2 } from 'lucide-react';

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Initial states from navigation
    const [userId] = useState(location.state?.userId);
    const [email] = useState(location.state?.email);
    const [isEmailVerified, setIsEmailVerified] = useState(location.state?.isEmailVerified || false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(location.state?.isPhoneVerified || false);

    const [emailCode, setEmailCode] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Redirect to login if both are done
    useEffect(() => {
        if (isEmailVerified && isPhoneVerified) {
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        }
    }, [isEmailVerified, isPhoneVerified, navigate]);

    const handleVerify = async (e, type) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/verify`, { 
                userId, 
                emailCode: type === 'email' ? emailCode : null,
                phoneCode: type === 'phone' ? phoneCode : null
            });
            
            if (type === 'email') setIsEmailVerified(res.data.isEmailVerified);
            if (type === 'phone') setIsPhoneVerified(res.data.isPhoneVerified);
            
            // Clear inputs
            setEmailCode('');
            setPhoneCode('');
        } catch (err) {
            setError(err.response?.data || `Invalid ${type} code.`);
        }
    };

    if (!userId) {
        return (
            <div className="flex h-screen items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <p className="text-zinc-500">Session expired or invalid.</p>
                    <button onClick={() => navigate('/register')} className="text-blue-600 font-bold underline">Back to Registration</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 pt-20">
            <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-zinc-200 overflow-hidden">
                <div className="p-8 text-center space-y-4 bg-zinc-900 text-white">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mx-auto">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Secure Verification</h2>
                        <p className="text-zinc-400 text-sm mt-1">Please verify your contact details</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {success ? (
                        <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-700 text-center animate-fade-in">
                            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
                            <h3 className="font-bold text-2xl mb-1">Identity Verified!</h3>
                            <p className="text-sm">Account fully activated. Redirecting to portal...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold animate-shake">
                                    {error}
                                </div>
                            )}

                            {/* EMAIL STEP */}
                            <div className={`p-6 rounded-3xl border-2 transition-all ${isEmailVerified ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-zinc-100'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 rounded-xl ${isEmailVerified ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-zinc-900">Email Verification</h4>
                                        <p className="text-xs text-zinc-500">{email}</p>
                                    </div>
                                    {isEmailVerified && <CheckCircle2 className="text-emerald-500 w-6 h-6" />}
                                </div>

                                {!isEmailVerified && (
                                    <form onSubmit={(e) => handleVerify(e, 'email')} className="space-y-3">
                                        <input 
                                            type="text"
                                            maxLength="6"
                                            className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xl font-bold text-center tracking-widest focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="000000"
                                            value={emailCode}
                                            onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                                        />
                                        <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                            <span>Verify Email</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* PHONE STEP */}
                            <div className={`p-6 rounded-3xl border-2 transition-all ${isPhoneVerified ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-zinc-100'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 rounded-xl ${isPhoneVerified ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-zinc-900">Mobile Verification</h4>
                                        <p className="text-xs text-zinc-500">Sent to your registered phone</p>
                                    </div>
                                    {isPhoneVerified && <CheckCircle2 className="text-emerald-500 w-6 h-6" />}
                                </div>

                                {!isPhoneVerified && (
                                    <form onSubmit={(e) => handleVerify(e, 'phone')} className="space-y-3">
                                        <input 
                                            type="text"
                                            maxLength="6"
                                            className="w-full px-5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xl font-bold text-center tracking-widest focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="000000"
                                            value={phoneCode}
                                            onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                                        />
                                        <button className="w-full py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                                            <span>Verify Mobile</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-zinc-50 p-6 border-t border-zinc-100 text-center">
                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em]">Security Protocol: TLS 1.3 Encryption Active</p>
                </div>
            </div>
        </div>
    );
};

export default Verify;
