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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  // Verification States
  const [userId, setUserId] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-redirect to login when both verified
  useEffect(() => {
    if (isEmailVerified && isPhoneVerified) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    }
  }, [isEmailVerified, isPhoneVerified, navigate]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, { 
        username, email, password, phoneNumber 
      });
      
      setUserId(res.data.userId);
      setStep('verify');
      
      if (res.data.debug_phone_code) {
        console.log('Phone code for testing:', res.data.debug_phone_code);
        alert(`Mobile Verification Code (Simulated): ${res.data.debug_phone_code}\n\nCheck terminal for Email code if credentials are not set.`);
      }
    } catch (err) {
      setError(err.response?.data || 'An error occurred');
    }
  };

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
      
      setEmailCode('');
      setPhoneCode('');
    } catch (err) {
      setError(err.response?.data || `Invalid ${type} code.`);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden pt-16">
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
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                    <input type="tel" className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="+1 234 567 890" />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                    <input type="password" className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" placeholder="••••••••" />
                  </div>
                </div>
                <div className="pt-2"><button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all uppercase tracking-wider">Sign Up</button></div>
              </form>
              <p className="mt-8 text-center text-sm text-zinc-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Log in</Link></p>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900">Secure Verification</h3>
                <p className="text-zinc-500 text-sm mt-1">Please verify your contact details to continue.</p>
              </div>

              {success ? (
                <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-700 text-center animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                  <h4 className="font-bold text-xl mb-1">Successfully Verified!</h4>
                  <p className="text-sm">Redirecting to login portal...</p>
                </div>
              ) : (
                <>
                  {error && <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-2"><span>{error}</span></div>}

                  <div className="space-y-4">
                    {/* EMAIL STEP */}
                    <div className={`p-6 rounded-2xl border-2 transition-all ${isEmailVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-zinc-50 border-zinc-100'}`}>
                      <div className="flex items-center gap-4 mb-3">
                        <Mail className={`w-5 h-5 ${isEmailVerified ? 'text-emerald-500' : 'text-zinc-500'}`} />
                        <div className="flex-1"><h4 className="font-bold text-sm text-zinc-900">Email Verification</h4><p className="text-[10px] text-zinc-500">{email}</p></div>
                        {isEmailVerified && <CheckCircle2 className="text-emerald-500 w-5 h-5" />}
                      </div>
                      {!isEmailVerified && (
                        <form onSubmit={(e) => handleVerify(e, 'email')} className="flex gap-2">
                          <input type="text" maxLength="6" className="flex-1 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-lg font-bold text-center tracking-widest outline-none focus:ring-2 focus:ring-blue-500" placeholder="000000" value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))} />
                          <button type="submit" className="px-4 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">Verify <ArrowRight className="w-3 h-3" /></button>
                        </form>
                      )}
                    </div>

                    {/* PHONE STEP */}
                    <div className={`p-6 rounded-2xl border-2 transition-all ${isPhoneVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-zinc-50 border-zinc-100'}`}>
                      <div className="flex items-center gap-4 mb-3">
                        <Phone className={`w-5 h-5 ${isPhoneVerified ? 'text-emerald-500' : 'text-zinc-500'}`} />
                        <div className="flex-1"><h4 className="font-bold text-sm text-zinc-900">Mobile Verification</h4><p className="text-[10px] text-zinc-500">{phoneNumber}</p></div>
                        {isPhoneVerified && <CheckCircle2 className="text-emerald-500 w-5 h-5" />}
                      </div>
                      {!isPhoneVerified && (
                        <form onSubmit={(e) => handleVerify(e, 'phone')} className="flex gap-2">
                          <input type="text" maxLength="6" className="flex-1 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-lg font-bold text-center tracking-widest outline-none focus:ring-2 focus:ring-blue-500" placeholder="000000" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))} />
                          <button type="submit" className="px-4 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">Verify <ArrowRight className="w-3 h-3" /></button>
                        </form>
                      )}
                    </div>
                  </div>
                </>
              )}
              <div className="pt-4 text-center"><button type="button" onClick={() => setStep('register')} className="text-xs text-zinc-400 hover:text-zinc-600 font-medium">Wrong details? Back to registration</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
