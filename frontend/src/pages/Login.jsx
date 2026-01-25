import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ROLES = ['user', 'driver', 'manager', 'admin'];

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
      const routes = { user: '/dashboard', manager: '/manager', driver: '/driver', admin: '/admin' };
      navigate(routes[user.role] || '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 p-4">
      <div className="w-full max-w-md animate-fadein">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 10h2a1 1 0 011 1v2h-2v-1h-1V10z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 10V8.5A1.5 1.5 0 0111.5 7h.5a1.5 1.5 0 011.5 1.5V10"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Smart Park</h1>
          <p className="text-gray-400 mt-1 text-sm">Intelligent Parking Management</p>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                className="input" placeholder="you@example.com" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                className="input" placeholder="••••••••" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input">
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-gray-800 capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center mb-3">Demo credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {[
                ['User', 'user@demo.com', 'User@123', 'user'],
                ['Manager', 'manager@demo.com', 'Manager@123', 'manager'],
                ['Driver', 'driver@demo.com', 'Driver@123', 'driver'],
                ['Admin', 'admin@demo.com', 'Admin@123', 'admin'],
              ].map(([label, email, pass, role]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ email, password: pass, role })}
                  className="text-left p-2.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
                >
                  <span className="block font-medium text-gray-300">{label}</span>
                  <span className="text-gray-500">{email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
