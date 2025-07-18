import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';

export default function BookingHistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError('');
    bookingApi
      .getHistory(user.id)
      .then(res => setBookings(res.data))
      .catch(() => setError('Failed to fetch booking history'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loader />;
  if (error) return <Notification type="error" message={error} />;

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Booking History</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No booking history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-3 border-b text-left">Hospital</th>
                <th className="px-4 py-3 border-b text-left">Ambulance No.</th>
                <th className="px-4 py-3 border-b text-left">Booking Type</th>
                <th className="px-4 py-3 border-b text-left">Patient</th>
                <th className="px-4 py-3 border-b text-left">Condition</th>
                <th className="px-4 py-3 border-b text-left">Date/Time</th>
                <th className="px-4 py-3 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-blue-50 transition duration-150">
                  <td className="px-4 py-3 text-gray-800">{b.hospitalName || b.hospital?.name}</td>
                  <td className="px-4 py-3 text-gray-800">{b.ambulanceNumber || b.ambulance?.number}</td>
                  <td className="px-4 py-3 text-gray-700">{b.bookingType}</td>
                  <td className="px-4 py-3 text-gray-700">{b.patient?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{b.patient?.condition || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.bookingTime
                      ? new Date(b.bookingTime).toLocaleString()
                      : b.date || b.createdAt?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        b.bookingStatus === 'COMPLETED'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : b.bookingStatus === 'ACTIVE'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      }`}
                    >
                      {b.bookingStatus || b.status}
                    </span>
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
