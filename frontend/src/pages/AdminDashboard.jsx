import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { adminAPI } from '../api/admin';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const ROLE_COLORS = {
  user:    'bg-blue-600/20 text-blue-400',
  manager: 'bg-purple-600/20 text-purple-400',
  admin:   'bg-amber-600/20 text-amber-400',
};

const STATE_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6',
];

// Custom tooltip for bar chart
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { state, revenue, bookings } = payload[0].payload;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-white mb-1">{state}</p>
      <p className="text-emerald-400">₹{revenue.toLocaleString()} earned</p>
      <p className="text-gray-400">{bookings} booking{bookings !== 1 ? 's' : ''}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics]       = useState(null);
  const [stateRevenue, setStateRevenue] = useState([]);
  const [users, setUsers]               = useState([]);
  const [tab, setTab]                   = useState('overview');
  const [loading, setLoading]           = useState(true);

  // Create lot form
  const [showCreateLot, setShowCreateLot] = useState(false);
  const [newLot, setNewLot]   = useState({ name: '', location: '', address: '', state: '', totalSlots: 20, pricePerHour: 50 });
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      const [aRes, uRes, sRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getUsers(),
        adminAPI.getStateRevenue(),
      ]);
      setAnalytics(aRes.data.data);
      setUsers(uRes.data.data);
      setStateRevenue(sRes.data.data || []);
    } catch { toast.error('Failed to load admin data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleCreateLot = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminAPI.createLot(newLot);
      toast.success('Parking lot created!');
      setShowCreateLot(false);
      setNewLot({ name: '', location: '', address: '', state: '', totalSlots: 20, pricePerHour: 50 });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lot');
    } finally { setCreating(false); }
  };

  const STAT_CARDS = analytics ? [
    { label: 'Total Users',     value: analytics.totalUsers,     color: 'from-blue-600 to-blue-800' },
    { label: 'Parking Lots',    value: analytics.totalLots,      color: 'from-emerald-600 to-emerald-800' },
    { label: 'Active Bookings', value: analytics.activeBookings, color: 'from-purple-600 to-purple-800' },
    { label: 'Total Revenue',   value: `₹${(analytics.totalRevenue || 0).toLocaleString()}`, color: 'from-amber-600 to-amber-800' },
    { label: 'Total Bookings',  value: analytics.totalBookings,  color: 'from-rose-600 to-rose-800' },
    { label: 'Managers',        value: analytics.totalManagers,  color: 'from-indigo-600 to-indigo-800' },
  ] : [];

  const totalStateRevenue = stateRevenue.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button onClick={() => setShowCreateLot(true)} className="btn-primary text-sm">
            ＋ New Parking Lot
          </button>
        </div>
        <p className="text-gray-400 mb-8">System administration and analytics</p>

        {/* Create Lot Modal */}
        {showCreateLot && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md p-6">
              <h2 className="text-lg font-bold text-white mb-5">Create Parking Lot</h2>
              <form onSubmit={handleCreateLot} className="space-y-4">
                <div>
                  <label className="label">Lot Name</label>
                  <input className="input w-full" required placeholder="e.g. South Block Garage"
                    value={newLot.name} onChange={e => setNewLot(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Location / City</label>
                  <input className="input w-full" required placeholder="e.g. Pune"
                    value={newLot.location} onChange={e => setNewLot(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div>
                  <label className="label">State</label>
                  <select className="input w-full" value={newLot.state} onChange={e => setNewLot(p => ({ ...p, state: e.target.value }))}>
                    <option value="">Select state</option>
                    {['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Address</label>
                  <input className="input w-full" placeholder="Street address"
                    value={newLot.address} onChange={e => setNewLot(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Total Slots</label>
                    <input className="input w-full" type="number" min="1" required
                      value={newLot.totalSlots} onChange={e => setNewLot(p => ({ ...p, totalSlots: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Price (₹/hr)</label>
                    <input className="input w-full" type="number" min="0" required
                      value={newLot.pricePerHour} onChange={e => setNewLot(p => ({ ...p, pricePerHour: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateLot(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={creating} className="btn-primary flex-1">
                    {creating ? 'Creating…' : 'Create Lot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-900 rounded-xl w-fit mb-8">
          {[['overview', 'Overview'], ['earnings', 'State Earnings'], ['users', 'Users']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>

        ) : tab === 'overview' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {STAT_CARDS.map(({ label, value, color }) => (
              <div key={label} className={`rounded-2xl p-6 bg-gradient-to-br ${color} shadow-lg`}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-white/70 mt-1">{label}</p>
              </div>
            ))}
          </div>

        ) : tab === 'earnings' ? (
          <div className="space-y-6">
            {/* Total banner */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg flex items-center justify-between">
              <div>
                <p className="text-amber-200 text-sm font-medium">Total Revenue (All States)</p>
                <p className="text-3xl font-bold text-white mt-1">₹{totalStateRevenue.toLocaleString()}</p>
              </div>
            </div>

            {stateRevenue.length === 0 ? (
              <div className="card text-center py-16 text-gray-500">
                <p>No completed bookings yet to show state earnings.</p>
                <p className="text-sm mt-1">Complete a booking to see revenue here.</p>
              </div>
            ) : (
              <>
                {/* Bar Chart */}
                <div className="card">
                  <h2 className="text-base font-semibold text-white mb-6">Revenue by State (₹)</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stateRevenue} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="state" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false}
                        tickFormatter={v => `₹${v}`} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
                      <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={64}>
                        {stateRevenue.map((_, i) => (
                          <Cell key={i} fill={STATE_COLORS[i % STATE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* State breakdown table */}
                <div className="card overflow-x-auto">
                  <h2 className="text-base font-semibold text-white mb-5">State Breakdown</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-800">
                        <th className="pb-3 pr-4">State</th>
                        <th className="pb-3 pr-4">Revenue</th>
                        <th className="pb-3 pr-4">Bookings</th>
                        <th className="pb-3">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {stateRevenue.map((s, i) => {
                        const share = totalStateRevenue > 0 ? Math.round((s.revenue / totalStateRevenue) * 100) : 0;
                        return (
                          <tr key={s.state}>
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={{ background: STATE_COLORS[i % STATE_COLORS.length] }} />
                                <span className="text-white font-medium">{s.state}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-emerald-400 font-semibold">₹{s.revenue.toLocaleString()}</td>
                            <td className="py-3 pr-4 text-gray-300">{s.bookings}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-800 rounded-full h-2 w-24">
                                  <div className="h-2 rounded-full transition-all"
                                    style={{ width: `${share}%`, background: STATE_COLORS[i % STATE_COLORS.length] }} />
                                </div>
                                <span className="text-gray-400 text-xs">{share}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

        ) : (
          /* Users tab */
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Joined</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="py-3 pr-4 text-white font-medium">{u.name}</td>
                    <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] || 'bg-gray-700 text-gray-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button onClick={() => handleDelete(u._id)} className="text-red-400 hover:text-red-300 text-xs transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center text-gray-500 py-8">No users found</p>}
          </div>
        )}
      </div>
    </div>
  );
}
