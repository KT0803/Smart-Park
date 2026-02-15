import { createContext, useContext, useState, useCallback } from 'react';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sp_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = useCallback(async (email, password, role) => {
    const res = await authAPI.login({ email, password, role });
    const { user, token, refreshToken } = res.data.data;
    localStorage.setItem('sp_token', token);
    localStorage.setItem('sp_refresh', refreshToken);
    localStorage.setItem('sp_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_refresh');
    localStorage.removeItem('sp_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom useAuth hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
