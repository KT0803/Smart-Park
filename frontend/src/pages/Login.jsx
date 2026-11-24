import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="inline-block mb-8"><Logo /></Link>
        <h1 className="text-3xl font-extrabold mb-1">Sign in</h1>
        <p className="text-muted mb-6">Enter your details to get to your bookings.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={form.email} onChange={handleChange}
              className="input" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" name="password" value={form.password} onChange={handleChange}
              className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="role">Sign in as</label>
            <select id="role" name="role" value={form.role} onChange={handleChange} className="input capitalize">
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-muted mt-6">
          No account yet?{' '}
          <Link to="/signup" className="text-ink font-semibold underline underline-offset-4">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
