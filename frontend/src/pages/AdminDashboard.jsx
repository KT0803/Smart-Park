import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { adminAPI } from '../api/admin';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const ROLE_TAGS = {
  user:    'text-info border-info/50',
  manager: 'text-warn border-warn/50',
  admin:   'text-ok border-ok/50',
};

const STATE_COLORS = [
  '#c98a00', '#3f7d58', '#b5472f', '#3b6a99', '#7a5c8e', '#6b675d',
];

// Custom tooltip for bar chart
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { state, revenue, bookings } = payload[0].payload;
  return (
    <div className="bg-surface text-ink border border-ink rounded-sm px-3 py-2 text-sm">
      <p className="font-semibold mb-0.5">{state}</p>
      <p className="font-mono">₹{revenue.toLocaleString()}</p>
      <p className="text-muted">{bookings} booking{bookings !== 1 ? 's' : ''}</p>
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
    { label: 'Users',           value: analytics.totalUsers },
    { label: 'Parking lots',    value: analytics.totalLots },
    { label: 'Active bookings', value: analytics.activeBookings },
    { label: 'Revenue',         value: `₹${(analytics.totalRevenue || 0).toLocaleString()}` },
    { label: 'All bookings',    value: analytics.totalBookings },
    { label: 'Managers',        value: analytics.totalManagers },
  ] : [];

  const totalStateRevenue = stateRevenue.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Admin</h1>
            <p className="text-muted mt-1">Users, lots and revenue</p>
          </div>
          <button onClick={() => setShowCreateLot(true)} className="btn-primary">
            New parking lot
          </button>
        </div>

        {/* Create Lot Modal */}
        {showCreateLot && (
          <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-md !p-6" style={{ boxShadow: '5px 5px 0 rgb(var(--ink))' }}>
              <h2 className="text-xl font-bold mb-5">Create parking lot</h2>
              <form onSubmit={handleCreateLot} className="space-y-4">
                <div>
                  <label className="label">Lot name</label>
                  <input className="input" required placeholder="e.g. South Block Garage"
                    value={newLot.name} onChange={e => setNewLot(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">City</label>
                  <input className="input" required placeholder="e.g. Pune"
                    value={newLot.location} onChange={e => setNewLot(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div>
                  <label className="label">State</label>
                  <select className="input" value={newLot.state} onChange={e => setNewLot(p => ({ ...p, state: e.target.value }))}>
                    <option value="">Select state</option>
                    {['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Address</label>
                  <input className="input" placeholder="Street address"
                    value={newLot.address} onChange={e => setNewLot(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Total slots</label>
                    <input className="input" type="number" min="1" required
                      value={newLot.totalSlots} onChange={e => setNewLot(p => ({ ...p, totalSlots: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Price (₹/hr)</label>
                    <input className="input" type="number" min="0" required
                      value={newLot.pricePerHour} onChange={e => setNewLot(p => ({ ...p, pricePerHour: e.target.value }))} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateLot(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={creating} className="btn-primary flex-1">
                    {creating ? 'Creating…' : 'Create lot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-6 border-b border-line mb-8">
          {[['overview', 'Overview'], ['earnings', 'State earnings'], ['users', 'Users']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`pb-2.5 -mb-px text-sm font-semibold border-b-2 ${
                tab === key ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted py-16">Loading…</p>

        ) : tab === 'overview' ? (
          <dl className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {STAT_CARDS.map(({ label, value }) => (
              <div key={label} className="card">
                <dt className="label !mb-2">{label}</dt>
                <dd className="font-mono text-3xl">{value}</dd>
              </div>
            ))}
          </dl>

        ) : tab === 'earnings' ? (
          <div className="space-y-6">
            <div>
              <p className="label !mb-1">Total revenue, all states</p>
              <p className="font-mono text-4xl">₹{totalStateRevenue.toLocaleString()}</p>
            </div>

            {stateRevenue.length === 0 ? (
              <div className="card text-center py-16 text-muted">
                <p>No completed bookings yet.</p>
                <p className="text-sm mt-1">Revenue shows up here once a booking is completed.</p>
              </div>
            ) : (
              <>
                <div className="card">
                  <h2 className="font-bold mb-6">Revenue by state (₹)</h2>
                  <div className="text-muted">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stateRevenue} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.2} />
                        <XAxis dataKey="state" tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false}
                          tickFormatter={v => `₹${v}`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', fillOpacity: 0.08 }} />
                        <Bar dataKey="revenue" radius={[2, 2, 0, 0]} maxBarSize={56}>
                          {stateRevenue.map((_, i) => (
                            <Cell key={i} fill={STATE_COLORS[i % STATE_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card overflow-x-auto">
                  <h2 className="font-bold mb-4">State breakdown</h2>
                  <table className="tbl w-full text-sm">
                    <thead>
                      <tr>
                        <th>State</th>
                        <th>Revenue</th>
                        <th>Bookings</th>
                        <th>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stateRevenue.map((s, i) => {
                        const share = totalStateRevenue > 0 ? Math.round((s.revenue / totalStateRevenue) * 100) : 0;
                        return (
                          <tr key={s.state}>
                            <td>
                              <span className="inline-flex items-center gap-2 font-semibold">
                                <span className="w-2.5 h-2.5 rounded-sm shrink-0"
                                  style={{ background: STATE_COLORS[i % STATE_COLORS.length] }} />
                                {s.state}
                              </span>
                            </td>
                            <td className="font-mono">₹{s.revenue.toLocaleString()}</td>
                            <td className="font-mono">{s.bookings}</td>
                            <td>
                              <span className="inline-flex items-center gap-2">
                                <span className="block bg-line h-1.5 w-24 rounded-sm">
                                  <span className="block h-1.5 rounded-sm"
                                    style={{ width: `${share}%`, background: STATE_COLORS[i % STATE_COLORS.length] }} />
                                </span>
                                <span className="font-mono text-xs text-muted">{share}%</span>
                              </span>
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
          <div className="card overflow-x-auto">
            <table className="tbl w-full text-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="font-semibold">{u.name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`tag ${ROLE_TAGS[u.role] || 'text-muted border-line'}`}>{u.role}</span>
                    </td>
                    <td className="font-mono text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(u._id)} className="text-bad text-sm underline underline-offset-4">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center text-muted py-8">No users found</p>}
          </div>
        )}
      </div>
    </div>
  );
}
