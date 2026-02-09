import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Attendee');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const roles = ['Attendee', 'Author', 'Admin'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/user/register', { username, email, password, role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'An error occurred');
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Panel - Professional/Dark */}
      <div className="hidden lg:flex w-2/5 flex-col justify-between bg-zinc-900 p-12 text-white relative overflow-hidden">
        {/* Abstract Architectural Lines */}
        <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}></div>
        
        <div className="relative z-10">
           <h1 className="text-2xl font-semibold tracking-wide uppercase text-blue-500">UniversityConf</h1>
        </div>

        <div className="relative z-10 max-w-md">
           <h2 className="text-5xl font-light leading-tight mb-6">
             Advancing <br/><span className="font-bold text-blue-500">Global Knowledge</span>
           </h2>
           <p className="text-zinc-400 text-lg font-light leading-relaxed">
             Join a premier network of scholars, researchers, and academic professionals. Manage your conference participation with efficiency and elegance.
           </p>
        </div>

        <div className="relative z-10 text-xs text-zinc-600 uppercase tracking-widest">
           © 2026 Grand University System
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center p-8 lg:p-12 h-full bg-white relative">
        <div className="w-full max-w-lg">
          
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-zinc-900 mb-2">Create Account</h3>
            <p className="text-zinc-500">Enter your credentials to access the portal.</p>
          </div>

          {/* Role Tabs */}
          <div className="mb-6">
             <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Select Role</label>
             <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border ${
                      role === r
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
             </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Username</label>
              <input
                type="text"
                className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-zinc-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength="3"
                placeholder="johndoe"
              />
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
              <input
                type="email"
                className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-zinc-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@university.edu"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
              <input
                type="password"
                className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-zinc-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all uppercase tracking-wider"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
