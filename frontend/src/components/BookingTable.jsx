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
      {isFree ? (
        <>
          <button
            onClick={() => onCancel(booking._id)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold
                       bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400
                       border border-emerald-200 dark:border-emerald-500/30
                       hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-all duration-150 active:scale-95"
          >
            ✕ Cancel (Free)
          </button>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">⏱ {secondsLeft}s left</span>
        </>
      ) : (
        <>
          <button
            onClick={() => onCancel(booking._id)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold
                       bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400
                       border border-amber-200 dark:border-amber-500/30
                       hover:bg-amber-100 dark:hover:bg-amber-500/25 transition-all duration-150 active:scale-95"
          >
            ✕ Cancel
          </button>
          {charge > 0 && (
            <span className="text-xs text-amber-600 dark:text-amber-500">₹{charge} charge</span>
          )}
        </>
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
      {/* Search + Clear All toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search by lot, slot, plate or status…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="btn-secondary text-sm px-4 py-2">
            Clear Search
          </button>
        )}
        {bookings.some(b => ['completed', 'cancelled'].includes(b.status)) && onClearAll && (
          <button
            onClick={() => {
              if (window.confirm('Clear all completed and cancelled bookings from your history? Active bookings will not be affected.')) {
                onClearAll();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                       bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400
                       border border-red-200 dark:border-red-500/30
                       hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-150 active:scale-95"
          >
            🗑 Clear All
          </button>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="card text-center py-16 text-slate-400 dark:text-gray-500">
          <p className="text-4xl mb-3">🅿️</p>
          <p>No bookings yet. Book your first spot above!</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12 text-slate-400 dark:text-gray-500">
          <p className="text-2xl mb-2">🔍</p>
          <p>No bookings match "<strong>{search}</strong>"</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          {/* Cancellation policy banner */}
          <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl px-4 py-3 mb-5 text-sm">
            <span className="text-amber-500 text-base mt-0.5">⚠️</span>
            <p className="text-amber-700 dark:text-amber-300">
              <span className="font-semibold">Cancellation Policy:</span> Cancel within <strong>1 minute</strong> for free.
              After that, you can still cancel but a <strong>charge based on elapsed hours (1 hr minimum)</strong> will apply.
            </p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400">
                {['Lot', 'Slot', 'Vehicle', 'Check-in', 'Amount', 'Status', 'Action'].map(h => (
                  <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
              {filtered.map(b => (
                <tr key={b._id} className="animate-fadein">
                  <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{b.lotId?.name || '—'}</td>
                  <td className="py-3 pr-4 text-slate-600 dark:text-gray-300">{b.slotId?.slotNumber || '—'}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-600 dark:text-gray-300">{b.vehiclePlate}</td>
                  <td className="py-3 pr-4 text-xs whitespace-nowrap text-slate-400 dark:text-gray-400">
                    {new Date(b.checkIn).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-slate-600 dark:text-gray-300">{b.totalAmount ? `₹${b.totalAmount}` : '—'}</td>
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
      )}
    </div>
  );
}
