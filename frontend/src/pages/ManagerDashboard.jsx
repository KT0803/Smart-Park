import { useState, useEffect } from 'react';
import { lotsAPI } from '../api/lots';
import { bookingsAPI } from '../api/bookings';
import { adminAPI } from '../api/admin';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  active: 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30',
  completed: 'bg-gray-600/20 text-gray-400 border border-gray-600/30',
  cancelled: 'bg-red-600/20 text-red-400 border border-red-600/30',
};

export default function ManagerDashboard() {
  const [lots, setLots]           = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [lotBookings, setLotBookings] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState('overview');

  // Add lot form state
  const [showAddLot, setShowAddLot] = useState(false);
  const [newLot, setNewLot]       = useState({ name: '', location: '', address: '', totalSlots: 20, pricePerHour: 50 });
  const [addingLot, setAddingLot] = useState(false);

  const fetchAll = async () => {
    try {
      const [lotsRes, analyticsRes] = await Promise.all([
        lotsAPI.getAll(),
        adminAPI.getAnalytics(),
      ]);
      setLots(lotsRes.data.data.lots || []);
      setAnalytics(analyticsRes.data.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const loadLotBookings = async (lot) => {
    setSelectedLot(lot);
    setTab('bookings');
    try {
      const res = await bookingsAPI.getLotBookings(lot._id);
      setLotBookings(res.data.data || []);
    } catch { toast.error('Failed to load bookings'); }
  };

  const handleComplete = async (bookingId) => {
    try {
      await bookingsAPI.complete(bookingId);
      toast.success('Booking marked as completed');
      if (selectedLot) loadLotBookings(selectedLot);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleAddLot = async (e) => {
    e.preventDefault();
    setAddingLot(true);
    try {
      await adminAPI.createLot(newLot);
      toast.success('Parking lot created!');
      setShowAddLot(false);
      setNewLot({ name: '', location: '', address: '', totalSlots: 20, pricePerHour: 50 });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lot');
    } finally { setAddingLot(false); }
  };

  const STAT_CARDS = analytics ? [
    { label: 'Parking Lots', value: analytics.totalLots, color: 'from-blue-600 to-blue-800' },
    { label: 'Active Bookings', value: analytics.activeBookings, color: 'from-emerald-600 to-emerald-800' },
    { label: 'Total Bookings', value: analytics.totalBookings, color: 'from-purple-600 to-purple-800' },
    { label: 'Revenue', value: `₹${(analytics.totalRevenue || 0).toLocaleString()}`, color: 'from-amber-600 to-amber-800' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
          <button onClick={() => setShowAddLot(true)} className="btn-primary flex items-center gap-2 text-sm">
            ＋ Add Parking Lot
          </button>
        </div>
        <p className="text-gray-400 mb-8">Oversee parking operations and analytics</p>

        {/* Add Lot Modal */}
        {showAddLot && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-md p-6">
              <h2 className="text-lg font-bold text-white mb-5">New Parking Lot</h2>
              <form onSubmit={handleAddLot} className="space-y-4">
                <div>
                  <label className="label">Lot Name</label>
                  <input className="input w-full" required placeholder="e.g. Central Park Garage"
                    value={newLot.name} onChange={e => setNewLot(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input className="input w-full" required placeholder="e.g. Downtown, MH"
                    value={newLot.location} onChange={e => setNewLot(p => ({ ...p, location: e.target.value }))} />
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
                  <button type="button" onClick={() => setShowAddLot(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={addingLot} className="btn-primary flex-1">
                    {addingLot ? 'Creating…' : 'Create Lot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-900 rounded-xl w-fit mb-8">
          {[['overview', 'Overview'], ['lots', 'My Lots'], ['bookings', 'Bookings']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'overview' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STAT_CARDS.map(({ label, value, color }) => (
                <div key={label} className={`rounded-2xl p-6 bg-gradient-to-br ${color} shadow-lg`}>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-white/70 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="card">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Lot Overview</h2>
              <div className="space-y-3">
                {lots.map(lot => {
                  const occupancy = lot.totalSlots > 0 ? Math.round(((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100) : 0;
                  return (
                    <div key={lot._id} className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white font-medium">{lot.name}</span>
                          <span className="text-xs text-gray-400">{occupancy}% occupied</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${occupancy}%` }} />
                        </div>
                      </div>
                      <button onClick={() => loadLotBookings(lot)} className="text-xs text-blue-400 hover:text-blue-300 flex-shrink-0">
                        View →
                      </button>
                    </div>
                  );
                })}
                {lots.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No lots assigned. Create one above.</p>}
              </div>
            </div>
          </div>
        ) : tab === 'lots' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lots.map(lot => (
              <div key={lot._id} className="card">
                <h3 className="font-semibold text-white">{lot.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{lot.location}</p>
                <div className="flex gap-2 mt-4 text-sm">
                  <span className="badge-available">{lot.availableSlots} free</span>
                  <span className="badge-occupied">{lot.totalSlots - lot.availableSlots} occupied</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">₹{lot.pricePerHour}/hr · {lot.totalSlots} total slots</p>
                <button onClick={() => loadLotBookings(lot)} className="btn-secondary w-full mt-4 text-sm py-2">
                  View Bookings
                </button>
              </div>
            ))}
            {lots.length === 0 && <p className="text-gray-500 col-span-3 text-center py-16">No lots yet. Click "Add Parking Lot" to create one.</p>}
          </div>
        ) : (
          <div>
            {selectedLot ? (
              <>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Bookings – {selectedLot.name}
                </h2>
                <div className="space-y-3">
                  {lotBookings.length === 0 ? (
                    <div className="card text-center py-12 text-gray-500">No bookings for this lot</div>
                  ) : (
                    lotBookings.map(b => (
                      <div key={b._id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{b.userId?.name} · {b.vehiclePlate}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Slot {b.slotId?.slotNumber} · {new Date(b.checkIn).toLocaleString()}
                          </p>
                          {b.totalAmount > 0 && (
                            <p className="text-xs text-emerald-400 mt-0.5">Total: ₹{b.totalAmount}</p>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${STATUS_COLORS[b.status] || ''}`}>
                            {b.status}
                          </span>
                        </div>
                        {b.status === 'active' && (
                          <button onClick={() => handleComplete(b._id)}
                            className="btn-primary text-sm py-1.5 px-4 flex-shrink-0">
                            ✓ Complete
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="card flex items-center justify-center h-64 text-gray-500 flex-col gap-3">
                <p>Select a lot from the "My Lots" tab to view its bookings</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
