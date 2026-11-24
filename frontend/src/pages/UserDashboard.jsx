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

  const handleClearAll = async () => {
    const clearable = myBookings.filter(b => ['completed', 'cancelled'].includes(b.status));
    if (clearable.length === 0) return toast('No completed or cancelled bookings to clear');
    try {
      const res = await bookingsAPI.clearHistory();
      const count = res.data.data?.deletedCount ?? clearable.length;
      toast.success(`${count} booking${count !== 1 ? 's' : ''} cleared`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear history');
    }
  };

  // Lot count per state
  const stateCounts = STATES.reduce((acc, s) => {
    acc[s] = s === 'All' ? allLots.length : allLots.filter(l => l.state === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">Hi, {user?.name}</h1>
          <p className="text-muted mt-1">Pick a lot, pick a slot.</p>
        </div>

        {/* Main tabs */}
        <div className="flex gap-6 border-b border-line mb-8">
          {[['lots', 'Parking lots'], ['myBookings', 'My bookings']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-2.5 -mb-px text-sm font-semibold border-b-2 ${
                tab === t ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted py-16">Loading…</p>
        ) : tab === 'lots' ? (
          <>
            {/* State filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {STATES.map(s => (
                <button key={s} onClick={() => setActiveState(s)}
                  className={`shrink-0 px-3 py-1.5 rounded text-sm border ${
                    activeState === s
                      ? 'bg-ink text-paper border-ink'
                      : 'border-ink/30 text-ink hover:border-ink'
                  }`}>
                  {s} <span className="font-mono text-xs opacity-60 ml-0.5">{stateCounts[s]}</span>
                </button>
              ))}
            </div>

            {/* Search + sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input type="text" placeholder="Search by name or location"
                value={search} onChange={e => setSearch(e.target.value)}
                className="input flex-1" />
              <input type="number" placeholder="Max ₹/hr"
                value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                className="input sm:w-32" />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input sm:w-44">
                <option value="name">Sort: name</option>
                <option value="price">Sort: cheapest</option>
                <option value="slots">Sort: most free</option>
              </select>
              {(search || maxPrice) && (
                <button onClick={() => { setSearch(''); setMaxPrice(''); }} className="btn-secondary">
                  Clear
                </button>
              )}
            </div>

            {activeState !== 'All' && (
              <h2 className="text-lg font-bold mb-5">
                {activeState} <span className="font-mono text-sm font-normal text-muted ml-1">{lots.length} lots</span>
              </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {lots.length === 0 ? (
                <p className="text-muted col-span-full py-16">
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
          <BookingTable bookings={myBookings} onCancel={handleCancel} onClearAll={handleClearAll} />
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
