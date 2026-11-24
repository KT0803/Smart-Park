import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface border-b border-line sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Logo size={28} />

        <div className="flex items-center gap-5 text-sm">
          <span className="hidden sm:inline text-muted">
            <span className="font-mono text-xs uppercase tracking-wide">{user?.role}</span>
            <span className="mx-2">/</span>
            <span className="text-ink font-medium">{user?.name}</span>
          </span>
          <button onClick={toggleTheme} className="text-muted hover:text-ink">
            {theme === 'dark' ? 'Light theme' : 'Dark theme'}
          </button>
          <button onClick={handleLogout} className="font-medium hover:text-bad">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
