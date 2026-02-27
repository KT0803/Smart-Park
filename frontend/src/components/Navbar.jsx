import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Navbar with logout button that clears sp_token and sp_refresh
export default function Navbar() {
  const { user, logout } = useAuth();
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
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">SP</span>
          </div>
          <span className="font-bold text-white text-lg">Smart Park</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-gray-400">{roleLabel[user?.role] || user?.role}</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs font-medium text-gray-200">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
