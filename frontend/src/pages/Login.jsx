import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ROLES = ['user', 'manager', 'admin'];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password, form.role);
      toast.success(`Welcome back, ${user.name}!`);
      const routes = { user: '/dashboard', manager: '/manager', admin: '/admin' };
      navigate(routes[user.role] || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 10h2a1 1 0 011 1v2h-2v-1h-1V10z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 10V8.5A1.5 1.5 0 0111.5 7h.5a1.5 1.5 0 011.5 1.5V10"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Sign in to Smart Park</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="input w-full" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className="input w-full" placeholder="••••••••" required />
            </div>
            <div>
              <label className="label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input w-full">
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-slate-100 dark:bg-gray-800 capitalize">
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 rounded-xl text-base font-semibold">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Create one</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
