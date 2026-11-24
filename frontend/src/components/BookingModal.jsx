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
      toast.success('Booking confirmed');
      onBooked();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
      <div className="card w-full max-w-md animate-fadein !p-6" style={{ boxShadow: '5px 5px 0 rgb(var(--ink))' }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Book a slot</h2>
            <p className="text-sm text-muted">{lot.name}</p>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="text-2xl leading-none text-muted hover:text-ink">
            ×
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="plate">Vehicle number plate</label>
            <input
              id="plate"
              className={`input font-mono ${plateError ? '!border-bad' : ''}`}
              placeholder="MH 01 AB 1234"
              value={vehiclePlate}
              onChange={handlePlateChange}
              maxLength={13}
              spellCheck={false}
            />
            {plateError ? (
              <p className="text-xs text-bad mt-1.5">{plateError}</p>
            ) : vehiclePlate && isValidPlate(vehiclePlate) ? (
              <p className="text-xs text-ok mt-1.5">Plate looks good</p>
            ) : (
              <p className="text-xs text-muted mt-1.5">State code, district, series, number.</p>
            )}
          </div>

          <div>
            <label className="label">
              Slot <span className="normal-case tracking-normal font-normal">({availableSlots.length} free)</span>
            </label>
            {fetchingSlots ? (
              <p className="text-sm text-muted py-6">Loading slots…</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {slots.map(s => (
                  <button
                    key={s._id}
                    disabled={s.status !== 'available'}
                    onClick={() => setSelectedSlot(s)}
                    className={`py-2 rounded font-mono text-xs border transition-colors ${
                      s.status !== 'available'
                        ? 'border-line text-muted/50 line-through cursor-not-allowed'
                        : selectedSlot?._id === s._id
                        ? 'bg-ink text-paper border-ink'
                        : 'border-ink/40 hover:border-ink hover:bg-accent/30'
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
              {loading ? 'Booking…' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
