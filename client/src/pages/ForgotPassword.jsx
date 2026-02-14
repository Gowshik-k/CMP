import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: Reset
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/forgot-password`, { email });
            setMessage('Reset code sent to your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data || 'Failed to send reset code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/reset-password`, {
                email,
                emailCode: resetCode,
                newPassword
            });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Failed to reset password. Check your code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset <br/><span class='font-bold text-blue-500'>Password</span>"
            subtitle="Securely recover your account access."
        >
            <div className="w-full max-w-lg">
                <div className="mb-8">
                    <Link to="/login" className="inline-flex items-center text-sm text-zinc-500 hover:text-blue-600 transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                    </Link>
                    <h3 className="text-3xl font-bold text-zinc-900 mb-2">
                        {step === 1 ? 'Forgot Password?' : 'Set New Password'}
                    </h3>
                    <p className="text-zinc-500 text-sm">
                        {step === 1 
                            ? "Enter your email address and we'll send you a recovery code." 
                            : "Enter the code sent to your email and your new password."}
                    </p>
                </div>

                {message && <div className="mb-4 p-3 rounded-md bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>{message}</div>}
                {error && <div className="mb-4 p-3 rounded-md bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRequestCode} className="space-y-4">
                        <div className="group">
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                                <input 
                                    type="email" 
                                    className="block w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    placeholder="name@university.edu" 
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all uppercase tracking-wider disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Recovery Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="group">
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Recovery Code</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                                <input 
                                    type="text" 
                                    className="block w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all tracking-widest" 
                                    value={resetCode} 
                                    onChange={(e) => setResetCode(e.target.value)} 
                                    required 
                                    placeholder="123456" 
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-sm font-medium text-zinc-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required 
                                minLength="6"
                                placeholder="New password" 
                            />
                        </div>
                        <div className="group">
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                minLength="6"
                                placeholder="Confirm new password" 
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all uppercase tracking-wider disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
