import { useState, useEffect } from 'react';
import { lotsAPI } from '../api/lots';
import { bookingsAPI } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Indian vehicle number plate regex: XX 00 XX 0000
// e.g. MH 01 AB 1234  |  DL 3C AB 1234  |  KA 05 MX 9999
const PLATE_REGEX = /^[A-Z]{2}\s\d{1,2}\s[A-Z]{1,3}\s\d{4}$/;

function isValidPlate(plate) {
  return PLATE_REGEX.test(plate.trim().toUpperCase());
}

export default function BookingModal({ lot, onClose, onBooked }) {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehiclePlate, setVehiclePlate] = useState(user?.vehicles?.[0]?.plateNumber || '');
  const [plateError, setPlateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(true);

  useEffect(() => {
    lotsAPI.getById(lot._id)
      .then(r => setSlots(r.data.data.slots))
      .catch(() => toast.error('Failed to load slots'))
      .finally(() => setFetchingSlots(false));
  }, [lot._id]);

  const availableSlots = slots.filter(s => s.status === 'available');

  const handlePlateChange = (e) => {
    const raw = e.target.value.toUpperCase();
    setVehiclePlate(raw);
    if (raw && !isValidPlate(raw)) {
      setPlateError('Format: XX 00 XX 0000 (e.g. MH 01 AB 1234)');
    } else {
      setPlateError('');
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) return toast.error('Please select a slot');
    if (!vehiclePlate.trim()) return toast.error('Vehicle plate required');
    if (!isValidPlate(vehiclePlate)) {
      setPlateError('Format: XX 00 XX 0000 (e.g. MH 01 AB 1234)');
      return toast.error('Invalid number plate format');
    }
    setLoading(true);
    try {
      await bookingsAPI.create({ lotId: lot._id, slotId: selectedSlot._id, vehiclePlate: vehiclePlate.trim().toUpperCase() });
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Book a Slot</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">{lot.name}</p>
          </div>
          <button onClick={onClose}
            className="text-2xl text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300 transition-colors">
            ×
          </button>
        </div>

        <div className="space-y-5">
          {/* Vehicle Plate with validation */}
          <div>
            <label className="label">Vehicle Number Plate</label>
            <input
              className={`input ${plateError ? 'ring-2 ring-red-500 border-transparent' : ''}`}
              placeholder="e.g. MH 01 AB 1234"
              value={vehiclePlate}
              onChange={handlePlateChange}
              maxLength={13}
              spellCheck={false}
            />
            {plateError ? (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {plateError}
              </p>
            ) : vehiclePlate && isValidPlate(vehiclePlate) ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                <span>✅</span> Valid Indian number plate
              </p>
            ) : (
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-1.5">
                Format: STATE CODE · DISTRICT · SERIES · NUMBER (e.g. MH 01 AB 1234)
              </p>
            )}
          </div>

          {/* Slot Grid */}
          <div>
            <label className="label">
              Select Slot <span className="text-slate-400 dark:text-gray-500 font-normal">({availableSlots.length} available)</span>
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
                        ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-400 cursor-not-allowed'
                        : selectedSlot?._id === s._id
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:border-blue-500'
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
            <button
              onClick={handleBook}
              disabled={loading || !selectedSlot || !!plateError || !vehiclePlate}
              className="btn-primary flex-1"
            >
              {loading ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
