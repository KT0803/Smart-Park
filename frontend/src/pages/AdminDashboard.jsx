import { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [aRes, uRes] = await Promise.all([adminAPI.getAnalytics(), adminAPI.getUsers()]);
      setAnalytics(aRes.data.data);
      setUsers(uRes.data.data);
    } catch { toast.error('Failed to load admin data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id, isApproved) => {
    try {
      await adminAPI.approveDriver(id, isApproved);
      toast.success(`Driver ${isApproved ? 'approved' : 'rejected'}`);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const STAT_CARDS = analytics ? [
    { label: 'Total Users', value: analytics.totalUsers, icon: '👤', color: 'from-blue-600 to-blue-800' },
    { label: 'Drivers', value: analytics.totalDrivers, icon: '🚗', color: 'from-purple-600 to-purple-800' },
    { label: 'Parking Lots', value: analytics.totalLots, icon: '🅿️', color: 'from-emerald-600 to-emerald-800' },
    { label: 'Active Bookings', value: analytics.activeBookings, icon: '📋', color: 'from-amber-600 to-amber-800' },
  ] : [];

  const pendingDrivers = users.filter(u => u.role === 'driver' && !u.isApproved);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-8">System administration and analytics</p>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-900 rounded-xl w-fit mb-8">
          {[['overview', '📊 Overview'], ['users', '👥 Users'], ['drivers', '🚗 Driver Approvals']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              {label}
              {key === 'drivers' && pendingDrivers.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{pendingDrivers.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'overview' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map(({ label, value, icon, color }) => (
              <div key={label} className={`rounded-2xl p-6 bg-gradient-to-br ${color} shadow-lg`}>
                <p className="text-3xl mb-1">{icon}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-white/70 mt-1">{label}</p>
              </div>
            ))}
          </div>
        ) : tab === 'users' ? (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map(u => (
                  <tr key={u._id} className="py-3">
                    <td className="py-3 pr-4 text-white font-medium">{u.name}</td>
                    <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`badge-${u.role === 'admin' ? 'active' : u.role === 'driver' ? 'pending' : 'available'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <button onClick={() => handleDelete(u._id)} className="text-red-400 hover:text-red-300 text-xs transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending Driver Approvals</h2>
            {pendingDrivers.length === 0 ? (
              <div className="card text-center py-12 text-gray-500">No pending approvals</div>
            ) : (
              pendingDrivers.map(d => (
                <div key={d._id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{d.name}</p>
                    <p className="text-sm text-gray-400">{d.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(d._id, true)} className="btn-primary text-sm py-1.5 px-4">Approve</button>
                    <button onClick={() => handleApprove(d._id, false)} className="btn-danger text-sm py-1.5 px-4">Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
