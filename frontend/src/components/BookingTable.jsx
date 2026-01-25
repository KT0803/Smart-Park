const STATUS_BADGE = {
  active: 'badge-active',
  pending: 'badge-pending',
  completed: 'badge-completed',
  cancelled: 'badge-completed',
};

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
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            {['Lot', 'Slot', 'Vehicle', 'Check-in', 'Amount', 'Status', ''].map(h => (
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
                {['pending', 'active'].includes(b.status) && (
                  <button
                    onClick={() => onCancel(b._id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
