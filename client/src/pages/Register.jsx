import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  
  // Registration States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Verification States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-redirect to login when verified
  useEffect(() => {
    if (isEmailVerified) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    }
  }, [isEmailVerified, navigate]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, { 
        username, email, password 
      });
      
      // Response now returns email for verification context, not userId
      setStep('verify');
      
    } catch (err) {
      setError(err.response?.data || 'An error occurred');
    }
  };

  const handleVerify = async (code) => {
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/verify`, { 
        email, 
        emailCode: code
      });
      
      setIsEmailVerified(res.data.isEmailVerified);
      setEmailCode('');
    } catch (err) {
      setError(err.response?.data || `Invalid code.`);
      setEmailCode('');
    }
  };

  // Auto-verify Email Code
  useEffect(() => {
    if (emailCode.length === 6 && !isEmailVerified) {
      handleVerify(emailCode);
    }
  }, [emailCode, isEmailVerified]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-white overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex w-2/5 flex-col justify-between bg-zinc-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}></div>
        <div className="relative z-10"><h1 className="text-2xl font-semibold tracking-wide uppercase text-blue-500">UniversityConf</h1></div>
        <div className="relative z-10 max-w-md">
           <h2 className="text-5xl font-light leading-tight mb-6">
             {step === 'register' ? <>Advancing <br/><span className="font-bold text-blue-500">Global Knowledge</span></> : <>Verify <br/><span className="font-bold text-blue-500">Identity</span></>}
           </h2>
           <p className="text-zinc-400 text-lg font-light leading-relaxed">
             Join a premier network of scholars, researchers, and academic professionals. Manage your conference participation with efficiency and elegance.
           </p>
        </div>
        <div className="relative z-10 text-xs text-zinc-600 uppercase tracking-widest">© 2026 Grand University System</div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center p-8 lg:p-12 h-full bg-white relative">
        <div className="w-full max-w-lg overflow-y-auto custom-scrollbar pr-2 max-h-full">
          
          {step === 'register' ? (
            <>
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-zinc-900 mb-2">Create Account</h3>
                <p className="text-zinc-500 text-sm">Enter your credentials to access the portal.</p>
              </div>

              {error && <div className="mb-4 p-3 rounded-md bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold">{error}</div>}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Username</label>
                    <input type="text" className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={username} onChange={(e) => setUsername(e.target.value)} required minLength="3" placeholder="johndoe" />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                    <input type="email" className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@university.edu" />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                    <input type="password" className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" placeholder="••••••••" />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Confirm Password</label>
                    <input type="password" className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength="6" placeholder="••••••••" />
                  </div>
                </div>
                <div className="pt-2"><button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all uppercase tracking-wider">Sign Up</button></div>
              </form>
              <p className="mt-8 text-center text-sm text-zinc-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Log in</Link></p>
            </>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-zinc-900">Verify Your Identity</h3>
                <p className="text-zinc-500 text-sm mt-1">Check your email for the verification code.</p>
              </div>

              {success ? (
                <div className="p-10 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-700 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                  <h4 className="font-bold text-xl mb-1">Account Verified!</h4>
                  <p className="text-sm">Redirecting to login portal...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm font-bold text-center">{error}</div>}

                  {/* Unified Verification Container */}
                  <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 space-y-6">
                    {/* EMAIL PART */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className={`w-4 h-4 ${isEmailVerified ? 'text-emerald-500' : 'text-zinc-400'}`} />
                          <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Email Code</span>
                        </div>
                        {isEmailVerified && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Verified</span>}
                      </div>
                      
                      {!isEmailVerified && (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            maxLength="6" 
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-2xl font-bold text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:tracking-normal placeholder:text-sm" 
                            placeholder="Type 6-digit code" 
                            value={emailCode} 
                            onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))} 
                          />
                          <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest">Automatic verification on 6th digit</p>
                        </div>
                      )}
                    </div>

                    </div>


                  <div className="text-center pt-2">
                    <button type="button" onClick={() => setStep('register')} className="text-xs text-zinc-400 hover:text-zinc-600 font-medium">Wrong details? Back to registration</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
