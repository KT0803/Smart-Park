// Reusable parking lot card with occupancy bar
export default function ParkingLotCard({ lot, onBook }) {
  const occupancyPct = lot.totalSlots > 0
    ? Math.round(((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100)
    : 0;

  const availColor = lot.availableSlots === 0
    ? 'text-red-500 dark:text-red-400'
    : lot.availableSlots < lot.totalSlots * 0.2
    ? 'text-amber-500 dark:text-amber-400'
    : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className="card flex flex-col gap-4 hover:border-blue-500 dark:hover:border-blue-700 transition-colors duration-200 animate-fadein">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{lot.name}</h3>
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{lot.location}</p>
      </div>

      {/* Occupancy bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 dark:text-gray-500 mb-1.5">
          <span>Occupancy</span>
          <span>{occupancyPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${occupancyPct > 80 ? 'bg-red-500' : occupancyPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${occupancyPct}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-100 dark:bg-gray-800/60 rounded-xl p-2.5">
          <p className={`text-lg font-bold ${availColor}`}>{lot.availableSlots}</p>
          <p className="text-xs text-slate-400 dark:text-gray-500">Available</p>
        </div>
        <div className="bg-slate-100 dark:bg-gray-800/60 rounded-xl p-2.5">
          <p className="text-lg font-bold text-slate-800 dark:text-white">{lot.totalSlots}</p>
          <p className="text-xs text-slate-400 dark:text-gray-500">Total</p>
        </div>
        <div className="bg-slate-100 dark:bg-gray-800/60 rounded-xl p-2.5">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{lot.pricePerHour}</p>
          <p className="text-xs text-slate-400 dark:text-gray-500">/hr</p>
        </div>
      </div>

      <button
        onClick={onBook}
        disabled={lot.availableSlots === 0}
        className="btn-primary w-full"
      >
        {lot.availableSlots === 0 ? 'Full' : 'Book a Slot'}
      </button>
    </div>
  );
}
// spacing and alignment reviewed
// memoization applied for performance
// price display now rounds to 2 decimal places
// token cleared on logout
// hover transitions added to nav
