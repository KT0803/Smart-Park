import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { lotsAPI } from '../api/lots';
import { bookingsAPI } from '../api/bookings';
import Navbar from '../components/Navbar';
import ParkingLotCard from '../components/ParkingLotCard';
import BookingModal from '../components/BookingModal';
import BookingTable from '../components/BookingTable';
import toast from 'react-hot-toast';

// User-facing dashboard for browsing lots and managing bookings
export default function UserDashboard() {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('lots');

  const fetchLots = useCallback(async () => {
    try {
      const res = await lotsAPI.getAll();
      setLots(res.data.data.lots);
    } catch { toast.error('Failed to load parking lots'); }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await bookingsAPI.getMy();
      setMyBookings(res.data.data.bookings);
    } catch { toast.error('Failed to load bookings'); }
  }, []);

  useEffect(() => {
    Promise.all([fetchLots(), fetchBookings()]).finally(() => setLoading(false));
    // Poll every 30 seconds for slot updates
    const timer = setInterval(fetchLots, 30000);
    return () => clearInterval(timer);
  }, [fetchLots, fetchBookings]);

  const handleCancel = async (id) => {
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      fetchBookings();
      fetchLots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-400 mt-1">Find and book your parking spot</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-900 rounded-xl w-fit mb-8">
          {['lots', 'myBookings'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t === 'lots' ? '🅿️ Parking Lots' : '📋 My Bookings'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'lots' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lots.length === 0 ? (
              <p className="text-gray-500 col-span-3 text-center py-16">No parking lots available</p>
            ) : (
              lots.map((lot) => (
                <ParkingLotCard key={lot._id} lot={lot} onBook={() => setSelectedLot(lot)} />
              ))
            )}
          </div>
        ) : (
          <BookingTable bookings={myBookings} onCancel={handleCancel} />
        )}
      </div>

      {selectedLot && (
        <BookingModal
          lot={selectedLot}
          onClose={() => setSelectedLot(null)}
          onBooked={() => { fetchLots(); fetchBookings(); setTab('myBookings'); }}
        />
      )}
    </div>
  );
}
