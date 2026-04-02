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

// Added: polling every 30s to refresh assignments
// Driver console with stats and assignment list
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
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Driver Console</h1>
        <p className="text-gray-400 mb-8">Your active and completed valet assignments</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: assignments.length, color: 'text-white' },
            { label: 'Active', value: assignments.filter(a => a.status === 'active').length, color: 'text-blue-400' },
            { label: 'Completed', value: assignments.filter(a => a.status === 'completed').length, color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card text-center">
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="card text-center py-16 text-gray-500">No assignments yet</div>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => (
              <div key={a._id} className="card animate-fadein">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{a.userId?.name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{a.lotId?.name} · Slot {a.slotId?.slotNumber} · Floor {a.slotId?.floor}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Vehicle: {a.vehiclePlate}</p>
                    <p className="text-xs text-gray-500">Check-in: {new Date(a.checkIn).toLocaleString()}</p>
                  </div>
                  <span className={STATUS_COLORS[a.status]}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
