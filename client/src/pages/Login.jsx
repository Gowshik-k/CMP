import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem('auth-token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Update global user state
      setUser(res.data.user);
      
      if (res.data.user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.requiresVerification) {
        // Redirect to verify if account is unverified
        navigate('/verify', { 
          state: { 
            userId: err.response.data.userId, 
            email,
            isEmailVerified: err.response.data.isEmailVerified,
            isPhoneVerified: err.response.data.isPhoneVerified
          } 
        });
        return;
      }
      setError(err.response?.data || 'An error occurred');
    }
  };

  return (
    <AuthLayout
      title="Welcome <br/><span class='font-bold text-blue-500'>Back</span>"
      subtitle="Access your personalized dashboard, review submissions, and coordinate with peers in real-time."
    >
      <div className="w-full max-w-lg">
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-zinc-900 mb-2">Member Login</h3>
          <p className="text-zinc-500">Please sign in to continue.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
          </div>
        )}

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@university.edu"
            />

            <div className="group">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-zinc-700">Password</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">Forgot Password?</a>
              </div>
              <input
                type="password"
                className="block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-zinc-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all uppercase tracking-wider"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
