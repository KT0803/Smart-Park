import { useState, useEffect } from 'react';

const CANCEL_WINDOW_SECONDS = 60;

const STATUS_BADGE = {
  active:    'badge-active',
  pending:   'badge-pending',
  completed: 'badge-completed',
  cancelled: 'badge-completed',
};

// Live countdown hook — returns seconds remaining in the 1-min free-cancel window
function useCancelCountdown(createdAt) {
  const getSecondsLeft = () => {
    const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
    return Math.max(0, CANCEL_WINDOW_SECONDS - elapsed);
  };
  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setInterval(() => {
      const s = getSecondsLeft();
      setSecondsLeft(s);
      if (s === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  return secondsLeft;
}

function CancelCell({ booking, onCancel }) {
  const secondsLeft = useCancelCountdown(booking.createdAt);
  const isFree = secondsLeft > 0;
  const checkInTime = booking.checkIn ? new Date(booking.checkIn).getTime() : new Date(booking.createdAt).getTime();
  const elapsedMs = Date.now() - checkInTime;
  const hours = Math.max(1, Math.ceil(elapsedMs / 3600000));
  const charge = (booking.lotId?.pricePerHour || 0) * hours;

  if (!['pending', 'active'].includes(booking.status)) return null;

  return (
    <div className="flex flex-col gap-1 items-start">
      <button
        onClick={() => onCancel(booking._id)}
        className={`text-sm font-semibold underline underline-offset-4 ${isFree ? 'text-ok' : 'text-bad'}`}
      >
        {isFree ? 'Cancel for free' : 'Cancel'}
      </button>
      {isFree ? (
        <span className="font-mono text-xs text-muted">{secondsLeft}s left</span>
      ) : (
        charge > 0 && <span className="font-mono text-xs text-muted">₹{charge} charge</span>
      )}
    </div>
  );
}

export default function BookingTable({ bookings, onCancel, onClearAll }) {
  const [search, setSearch] = useState('');

  const filtered = bookings.filter(b => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.lotId?.name?.toLowerCase().includes(q) ||
      b.slotId?.slotNumber?.toLowerCase().includes(q) ||
      b.vehiclePlate?.toLowerCase().includes(q) ||
      b.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          type="text"
          placeholder="Search by lot, slot, plate or status"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input flex-1"
        />
        {search && (
          <button onClick={() => setSearch('')} className="btn-secondary">
            Clear search
          </button>
        )}
        {bookings.some(b => ['completed', 'cancelled'].includes(b.status)) && onClearAll && (
          <button
            onClick={() => {
              if (window.confirm('Clear all completed and cancelled bookings from your history? Active bookings will not be affected.')) {
                onClearAll();
              }
            }}
            className="btn-danger"
          >
            Clear history
          </button>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="card text-center py-16 text-muted">
          <p>No bookings yet. Pick a lot and book your first spot.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12 text-muted">
          <p>No bookings match "<strong className="text-ink">{search}</strong>"</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <p className="text-sm text-muted border-l-2 border-accent pl-3 mb-5">
            <span className="font-semibold text-ink">Cancellation:</span> free within 1 minute of booking.
            After that you pay for the hours elapsed, 1 hour minimum.
          </p>

          <table className="tbl w-full text-sm">
            <thead>
              <tr>
                {['Lot', 'Slot', 'Vehicle', 'Check-in', 'Amount', 'Status', ''].map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b._id} className="animate-fadein">
                  <td className="font-semibold">{b.lotId?.name || '—'}</td>
                  <td className="font-mono">{b.slotId?.slotNumber || '—'}</td>
                  <td className="font-mono text-xs">{b.vehiclePlate}</td>
                  <td className="text-xs whitespace-nowrap text-muted">
                    {new Date(b.checkIn).toLocaleString()}
                  </td>
                  <td className="font-mono">{b.totalAmount ? `₹${b.totalAmount}` : '—'}</td>
                  <td>
                    <span className={STATUS_BADGE[b.status] || 'badge-completed'}>{b.status}</span>
                  </td>
                  <td>
                    <CancelCell booking={b} onCancel={onCancel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
