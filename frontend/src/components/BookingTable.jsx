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
  const charge = booking.lotId?.pricePerHour;

  if (!['pending', 'active'].includes(booking.status)) return null;

  return (
    <div className="flex flex-col gap-1 items-start">
      {isFree ? (
        <>
          <button
            onClick={() => onCancel(booking._id)}
            className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
          >
            Cancel (Free)
          </button>
          <span className="text-xs text-emerald-400 font-mono">⏱ {secondsLeft}s left</span>
        </>
      ) : (
        <>
          <button
            onClick={() => onCancel(booking._id)}
            className="text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          {charge && (
            <span className="text-xs text-amber-500">₹{charge} base charge</span>
          )}
        </>
      )}
    </div>
  );
}

export default function BookingTable({ bookings, onCancel }) {
  if (bookings.length === 0) {
    return (
      <div className="card text-center py-16 text-gray-500">
        <p className="text-4xl mb-3">🅿️</p>
        <p>No bookings yet. Book your first spot above!</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      {/* Cancellation policy banner */}
      <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-5 text-sm">
        <span className="text-amber-400 text-base mt-0.5">⚠️</span>
        <p className="text-amber-300">
          <span className="font-semibold">Cancellation Policy:</span> Cancel within <strong>1 minute</strong> for free.
          After that, you can still cancel but a <strong>base charge (1 hr rate)</strong> will apply.
        </p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            {['Lot', 'Slot', 'Vehicle', 'Check-in', 'Amount', 'Status', 'Action'].map(h => (
              <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {bookings.map(b => (
            <tr key={b._id} className="animate-fadein">
              <td className="py-3 pr-4 text-white font-medium">{b.lotId?.name || '—'}</td>
              <td className="py-3 pr-4 text-gray-300">{b.slotId?.slotNumber || '—'}</td>
              <td className="py-3 pr-4 text-gray-300 font-mono text-xs">{b.vehiclePlate}</td>
              <td className="py-3 pr-4 text-gray-400 text-xs whitespace-nowrap">{new Date(b.checkIn).toLocaleString()}</td>
              <td className="py-3 pr-4 text-gray-300">{b.totalAmount ? `₹${b.totalAmount}` : '—'}</td>
              <td className="py-3 pr-4">
                <span className={STATUS_BADGE[b.status] || 'badge-completed'}>{b.status}</span>
              </td>
              <td className="py-3">
                <CancelCell booking={b} onCancel={onCancel} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
