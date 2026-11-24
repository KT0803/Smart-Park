// Reusable parking lot card with occupancy bar
export default function ParkingLotCard({ lot, onBook }) {
  const occupancyPct = lot.totalSlots > 0
    ? Math.round(((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100)
    : 0;

  const availColor = lot.availableSlots === 0
    ? 'text-bad'
    : lot.availableSlots < lot.totalSlots * 0.2
    ? 'text-warn'
    : 'text-ok';

  const barColor = occupancyPct > 80 ? 'bg-bad' : occupancyPct > 50 ? 'bg-warn' : 'bg-ok';

  return (
    <div className="card flex flex-col animate-fadein">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold leading-tight">{lot.name}</h3>
          <p className="text-sm text-muted mt-0.5">{lot.location}</p>
        </div>
        <p className="font-mono text-right shrink-0">
          <span className="text-lg">₹{lot.pricePerHour}</span>
          <span className="block text-[11px] text-muted uppercase">per hr</span>
        </p>
      </div>

      <div className="mt-5">
        <div className="flex justify-between items-baseline font-mono text-sm">
          <span className={availColor}>{lot.availableSlots} free</span>
          <span className="text-muted">of {lot.totalSlots}</span>
        </div>
        <div className="w-full h-2 bg-line mt-1.5 rounded-sm overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${occupancyPct}%` }} />
        </div>
      </div>

      <button
        onClick={onBook}
        disabled={lot.availableSlots === 0}
        className="btn-primary w-full mt-5"
      >
        {lot.availableSlots === 0 ? 'Full' : 'Book a slot'}
      </button>
    </div>
  );
}
