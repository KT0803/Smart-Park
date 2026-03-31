import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { lotsAPI } from '../api/lots';
import { bookingsAPI } from '../api/bookings';
import Navbar from '../components/Navbar';
import ParkingLotCard from '../components/ParkingLotCard';
import BookingModal from '../components/BookingModal';
import BookingTable from '../components/BookingTable';
import toast from 'react-hot-toast';

const STATES = ['All', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan'];

const STATE_EMOJI = {
  Maharashtra: '🏙️', Delhi: '🏛️', Karnataka: '🌆',
  'Tamil Nadu': '🌊', Gujarat: '🏗️', Rajasthan: '🏰',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [allLots, setAllLots]       = useState([]);
  const [lots, setLots]             = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState('lots');
  const [activeState, setActiveState] = useState('All');
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('name');
  const [maxPrice, setMaxPrice]     = useState('');

  const fetchLots = useCallback(async () => {
    try {
      const res = await lotsAPI.getAll();
      setAllLots(res.data.data.lots || []);
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
    const timer = setInterval(fetchLots, 30000);
    return () => clearInterval(timer);
  }, [fetchLots, fetchBookings]);

  useEffect(() => {
    let filtered = [...allLots];
    if (activeState !== 'All') filtered = filtered.filter(l => l.state === activeState);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
      );
    }
    if (maxPrice) filtered = filtered.filter(l => l.pricePerHour <= Number(maxPrice));
    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.pricePerHour - b.pricePerHour;
      if (sortBy === 'slots') return b.availableSlots - a.availableSlots;
      return a.name.localeCompare(b.name);
    });
    setLots(filtered);
  }, [allLots, activeState, search, maxPrice, sortBy]);

  const handleCancel = async (id) => {
    try {
      await bookingsAPI.cancel(id);
      toast.success('Booking cancelled');
      fetchBookings(); fetchLots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  // Lot count per state
  const stateCounts = STATES.reduce((acc, s) => {
    acc[s] = s === 'All' ? allLots.length : allLots.filter(l => l.state === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-400 mt-1">Find and book your parking spot</p>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-1 p-1 bg-gray-900 rounded-xl w-fit mb-8">
          {[['lots', '🅿️ Parking Lots'], ['myBookings', '📋 My Bookings']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'lots' ? (
          <>
            {/* State Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {STATES.map(s => (
                <button key={s} onClick={() => setActiveState(s)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    activeState === s
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}>
                  {s !== 'All' && <span>{STATE_EMOJI[s]}</span>}
                  <span>{s}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeState === s ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {stateCounts[s]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search + Sort bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input type="text" placeholder="Search by name or location…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input w-full pl-9" />
              </div>
              <input type="number" placeholder="Max ₹/hr"
                value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                className="input w-32" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input w-44">
                <option value="name">Sort: Name</option>
                <option value="price">Sort: Price ↑</option>
                <option value="slots">Sort: Most Free</option>
              </select>
              {(search || maxPrice) && (
                <button onClick={() => { setSearch(''); setMaxPrice(''); }} className="btn-secondary text-sm">
                  Clear
                </button>
              )}
            </div>

            {/* Section header */}
            {activeState !== 'All' && (
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">{STATE_EMOJI[activeState]}</span>
                <h2 className="text-lg font-semibold text-white">{activeState}</h2>
                <span className="text-sm text-gray-500">· {lots.length} lots</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lots.length === 0 ? (
                <p className="text-gray-500 col-span-3 text-center py-16">
                  {allLots.length === 0 ? 'No parking lots available' : 'No lots match your filters'}
                </p>
              ) : (
                lots.map((lot) => (
                  <ParkingLotCard key={lot._id} lot={lot} onBook={() => setSelectedLot(lot)} />
                ))
              )}
            </div>
          </>
        ) : (
          <BookingTable bookings={myBookings} onCancel={handleCancel} />
        )}
      </div>

      {selectedLot && (
        <BookingModal
          lot={selectedLot}
          onClose={() => setSelectedLot(null)}
          onBooked={() => { fetchLots(); fetchBookings(); setSelectedLot(null); setTab('myBookings'); }}
        />
      )}
    </div>
  );
}
