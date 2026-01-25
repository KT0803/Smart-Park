import { useState, useEffect } from 'react';
import { lotsAPI } from '../api/lots';
import { bookingsAPI } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function BookingModal({ lot, onClose, onBooked }) {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehiclePlate, setVehiclePlate] = useState(user?.vehicles?.[0]?.plateNumber || '');
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(true);

  useEffect(() => {
    lotsAPI.getById(lot._id)
      .then(r => setSlots(r.data.data.slots))
      .catch(() => toast.error('Failed to load slots'))
      .finally(() => setFetchingSlots(false));
  }, [lot._id]);

  const availableSlots = slots.filter(s => s.status === 'available');

  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Please select a slot');
    if (!vehiclePlate.trim()) return toast.error('Vehicle plate required');
    setLoading(true);
    try {
      await bookingsAPI.create({ lotId: lot._id, slotId: selectedSlot._id, vehiclePlate });
      toast.success('Booking confirmed! 🎉');
      onBooked();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md animate-fadein">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Book a Slot</h2>
            <p className="text-sm text-gray-400">{lot.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors text-2xl">×</button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Vehicle Plate</label>
            <input
              className="input"
              placeholder="e.g. MH 01 AB 1234"
              value={vehiclePlate}
              onChange={e => setVehiclePlate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Slot <span className="text-gray-500">({availableSlots.length} available)</span>
            </label>
            {fetchingSlots ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {slots.map(s => (
                  <button
                    key={s._id}
                    disabled={s.status !== 'available'}
                    onClick={() => setSelectedSlot(s)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                      s.status !== 'available'
                        ? 'bg-red-900/30 border-red-800 text-red-400 cursor-not-allowed'
                        : selectedSlot?._id === s._id
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {s.slotNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleBook} disabled={loading || !selectedSlot} className="btn-primary flex-1">
              {loading ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
