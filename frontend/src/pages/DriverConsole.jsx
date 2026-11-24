import { useState, useEffect } from 'react';
import { driversAPI } from '../api/admin';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  active: 'badge-active',
  completed: 'badge-completed',
  cancelled: 'badge-completed',
  pending: 'badge-pending',
};

// Polls every 30s to refresh assignments
export default function DriverConsole() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    driversAPI.getMyAssignments()
      .then(r => setAssignments(r.data.data))
      .catch(() => toast.error('Failed to load assignments'))
      .finally(() => setLoading(false));
    const timer = setInterval(() => {
      driversAPI.getMyAssignments().then(r => setAssignments(r.data.data)).catch(() => {});
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold">Driver console</h1>
        <p className="text-muted mt-1 mb-8">Your valet assignments</p>

        <dl className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: assignments.length },
            { label: 'Active', value: assignments.filter(a => a.status === 'active').length },
            { label: 'Completed', value: assignments.filter(a => a.status === 'completed').length },
          ].map(({ label, value }) => (
            <div key={label} className="card">
              <dt className="label !mb-1">{label}</dt>
              <dd className="font-mono text-3xl">{value}</dd>
            </div>
          ))}
        </dl>

        {loading ? (
          <p className="text-muted py-16">Loading…</p>
        ) : assignments.length === 0 ? (
          <div className="card text-center py-16 text-muted">No assignments yet</div>
        ) : (
          <div className="space-y-3">
            {assignments.map((a) => (
              <div key={a._id} className="card animate-fadein flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{a.userId?.name}</p>
                  <p className="text-sm text-muted mt-0.5">{a.lotId?.name}, slot {a.slotId?.slotNumber}, floor {a.slotId?.floor}</p>
                  <p className="font-mono text-xs text-muted mt-1">{a.vehiclePlate}</p>
                  <p className="text-xs text-muted">Check-in {new Date(a.checkIn).toLocaleString()}</p>
                </div>
                <span className={STATUS_COLORS[a.status]}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
