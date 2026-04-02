import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = {
    user: '👤 User',
    manager: '🏢 Manager',
    driver: '🚗 Driver',
    admin: '⚙️ Admin',
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">SP</span>
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">Smart Park</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* User role badge */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-gray-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-500 dark:text-gray-400">
              {roleLabel[user?.role] || user?.role}
            </span>
            <span className="text-slate-300 dark:text-gray-600">·</span>
            <span className="text-xs font-medium text-slate-800 dark:text-gray-200">
              {user?.name}
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
                       hover:scale-105 active:scale-95
                       bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700"
          >
            <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-slate-500 dark:text-gray-400
                       hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
