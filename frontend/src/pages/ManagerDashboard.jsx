import { useState, useEffect } from 'react';
import { lotsAPI } from '../api/lots';
import { bookingsAPI } from '../api/bookings';
import { adminAPI } from '../api/admin';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  active: 'badge-active',
  completed: 'badge-completed',
  cancelled: 'badge-occupied',
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
    { label: 'Parking lots',    value: analytics.totalLots },
    { label: 'Active bookings', value: analytics.activeBookings },
    { label: 'All bookings',    value: analytics.totalBookings },
    { label: 'Revenue',         value: `₹${(analytics.totalRevenue || 0).toLocaleString()}` },
  ] : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Manager</h1>
            <p className="text-muted mt-1">Your lots and their bookings</p>
          </div>
          <button onClick={() => setShowAddLot(true)} className="btn-primary">
            Add parking lot
          </button>
        </div>

        {/* Add Lot Modal */}
        {showAddLot && (
          <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
            <div className="card w-full max-w-md !p-6" style={{ boxShadow: '5px 5px 0 rgb(var(--ink))' }}>
              <h2 className="text-xl font-bold mb-5">New parking lot</h2>
              <form onSubmit={handleAddLot} className="space-y-4">
                <div>
                  <label className="label">Lot name</label>
                  <input className="input" required placeholder="e.g. Central Park Garage"
                    value={newLot.name} onChange={e => setNewLot(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input className="input" required placeholder="e.g. Downtown, MH"
                    value={newLot.location} onChange={e => setNewLot(p => ({ ...p, location: e.target.value }))} />
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
                  <button type="button" onClick={() => setShowAddLot(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={addingLot} className="btn-primary flex-1">
                    {addingLot ? 'Creating…' : 'Create lot'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-6 border-b border-line mb-8">
          {[['overview', 'Overview'], ['lots', 'My lots'], ['bookings', 'Bookings']].map(([key, label]) => (
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
          <div className="space-y-8">
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STAT_CARDS.map(({ label, value }) => (
                <div key={label} className="card">
                  <dt className="label !mb-2">{label}</dt>
                  <dd className="font-mono text-3xl">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="card">
              <h2 className="label !mb-4">Occupancy by lot</h2>
              <div className="space-y-4">
                {lots.map(lot => {
                  const occupancy = lot.totalSlots > 0 ? Math.round(((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100) : 0;
                  return (
                    <div key={lot._id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-semibold">{lot.name}</span>
                          <span className="font-mono text-xs text-muted">{occupancy}%</span>
                        </div>
                        <div className="h-2 bg-line rounded-sm overflow-hidden">
                          <div className="h-full bg-ink" style={{ width: `${occupancy}%` }} />
                        </div>
                      </div>
                      <button onClick={() => loadLotBookings(lot)} className="text-sm underline underline-offset-4 shrink-0">
                        Bookings
                      </button>
                    </div>
                  );
                })}
                {lots.length === 0 && <p className="text-muted text-sm py-6">No lots assigned. Add one with the button above.</p>}
              </div>
            </div>
          </div>
        ) : tab === 'lots' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lots.map(lot => (
              <div key={lot._id} className="card">
                <h3 className="font-bold text-lg leading-tight">{lot.name}</h3>
                <p className="text-sm text-muted mt-0.5">{lot.location}</p>
                <div className="flex gap-2 mt-4">
                  <span className="badge-available">{lot.availableSlots} free</span>
                  <span className="badge-occupied">{lot.totalSlots - lot.availableSlots} taken</span>
                </div>
                <p className="font-mono text-xs text-muted mt-3">₹{lot.pricePerHour}/hr, {lot.totalSlots} slots</p>
                <button onClick={() => loadLotBookings(lot)} className="btn-secondary w-full mt-4">
                  View bookings
                </button>
              </div>
            ))}
            {lots.length === 0 && <p className="text-muted col-span-full py-16">No lots yet. Use "Add parking lot" to create one.</p>}
          </div>
        ) : (
          <div>
            {selectedLot ? (
              <>
                <h2 className="text-lg font-bold mb-4">{selectedLot.name}</h2>
                <div className="space-y-3">
                  {lotBookings.length === 0 ? (
                    <div className="card text-center py-12 text-muted">No bookings for this lot</div>
                  ) : (
                    lotBookings.map(b => (
                      <div key={b._id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="font-semibold">
                            {b.userId?.name} <span className="font-mono font-normal text-sm text-muted ml-1">{b.vehiclePlate}</span>
                          </p>
                          <p className="text-sm text-muted mt-0.5">
                            Slot {b.slotId?.slotNumber}, {new Date(b.checkIn).toLocaleString()}
                          </p>
                          {b.totalAmount > 0 && (
                            <p className="font-mono text-sm mt-0.5">₹{b.totalAmount}</p>
                          )}
                          <span className={`${STATUS_COLORS[b.status] || 'badge-completed'} mt-2`}>{b.status}</span>
                        </div>
                        {b.status === 'active' && (
                          <button onClick={() => handleComplete(b._id)} className="btn-primary shrink-0">
                            Mark complete
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="card text-center py-16 text-muted">
                Pick a lot from "My lots" to see its bookings.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
