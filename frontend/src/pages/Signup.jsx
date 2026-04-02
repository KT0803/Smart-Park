import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password, role: 'user' });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white text-xl mx-auto mb-4 shadow-lg shadow-blue-600/30">
            SP
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Start parking smarter today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input w-full" required placeholder="Your full name"
                value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input w-full" type="email" required placeholder="you@example.com"
                value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input w-full" type="password" required placeholder="Min. 6 characters"
                value={form.password} onChange={set('password')} />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input className="input w-full" type="password" required placeholder="Repeat your password"
                value={form.confirmPassword} onChange={set('confirmPassword')} />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 mt-2 rounded-xl text-base font-semibold">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Sign in</Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
