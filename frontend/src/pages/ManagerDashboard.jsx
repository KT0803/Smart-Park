import { useState, useEffect } from 'react';
import { lotsAPI } from '../api/lots';
import { bookingsAPI } from '../api/bookings';
import { driversAPI } from '../api/admin';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

// Manager dashboard – parking operations overview
export default function ManagerDashboard() {
  const [lots, setLots] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [lotBookings, setLotBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      lotsAPI.getAll().then(r => setLots(r.data.data.lots)),
      driversAPI.getAll().then(r => setDrivers(r.data.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const loadLotBookings = async (lot) => {
    setSelectedLot(lot);
    try {
      const res = await bookingsAPI.getLotBookings(lot._id);
      setLotBookings(res.data.data);
    } catch { toast.error('Failed to load bookings'); }
  };

  const handleAssign = async (bookingId, driverId) => {
    try {
      await driversAPI.assign(bookingId, driverId);
      toast.success('Driver assigned');
      if (selectedLot) loadLotBookings(selectedLot);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await bookingsAPI.complete(bookingId);
      toast.success('Booking completed');
      if (selectedLot) loadLotBookings(selectedLot);
      lotsAPI.getAll().then(r => setLots(r.data.data.lots));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Manager Dashboard</h1>
        <p className="text-gray-400 mb-8">Oversee parking operations and manage driver assignments</p>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lot List */}
            <div className="lg:col-span-1">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Parking Lots</h2>
              <div className="space-y-3">
                {lots.map((lot) => (
                  <button
                    key={lot._id}
                    onClick={() => loadLotBookings(lot)}
                    className={`w-full text-left card hover:border-blue-600 transition-colors ${selectedLot?._id === lot._id ? 'border-blue-600' : ''}`}
                  >
                    <p className="font-semibold text-white">{lot.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{lot.location}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="badge-available">{lot.availableSlots} free</span>
                      <span className="badge-occupied">{lot.totalSlots - lot.availableSlots} occupied</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings for selected lot */}
            <div className="lg:col-span-2">
              {selectedLot ? (
                <>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Bookings – {selectedLot.name}
                  </h2>
                  <div className="space-y-3">
                    {lotBookings.length === 0 ? (
                      <div className="card text-center py-12 text-gray-500">No bookings for this lot</div>
                    ) : (
                      lotBookings.map((b) => (
                        <div key={b._id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{b.userId?.name} · {b.vehiclePlate}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Slot {b.slotId?.slotNumber} · {new Date(b.checkIn).toLocaleString()}</p>
                            <span className={`badge-${b.status} mt-2 inline-block`}>{b.status}</span>
                          </div>
                          {b.status === 'active' && (
                            <div className="flex gap-2 flex-shrink-0">
                              <select
                                className="input text-sm py-1.5 px-3 w-40"
                                onChange={(e) => handleAssign(b._id, e.target.value)}
                                defaultValue=""
                              >
                                <option value="" disabled>Assign driver…</option>
                                {drivers.filter(d => d.isApproved).map(d => (
                                  <option key={d._id} value={d._id}>{d.name}</option>
                                ))}
                              </select>
                              <button onClick={() => handleComplete(b._id)} className="btn-secondary text-sm py-1.5">
                                Complete
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="card flex items-center justify-center h-64 text-gray-500">
                  Select a parking lot to view bookings
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
