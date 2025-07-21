import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookings = (pageNum = 1) => {
    setLoading(true);
    setError('');
    adminApi
      .getAllBookingsPaged(pageNum - 1, 10)
      .then(res => {
        setBookings(res.data.content || res.data);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => setError('Failed to fetch bookings'))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await adminApi.changeBookingStatus(bookingId, newStatus);
      setSuccess('Booking status updated!');
      fetchBookings(page);
    } catch {
      setError('Failed to update booking status');
    }
  };

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg">
      <button
        onClick={() => navigate('/admin')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-150 shadow"
      >
        ← Back
      </button>
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">All Bookings</h2>

      {success && <Notification type="success" message={success} />}
      {error && <Notification type="error" message={error} />}
      {loading && <Loader />}

      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr className="text-left">
              <th className="px-5 py-3 border-b font-medium">Booking ID</th>
              <th className="px-5 py-3 border-b font-medium">User</th>
              <th className="px-5 py-3 border-b font-medium">Hospital</th>
              <th className="px-5 py-3 border-b font-medium">Ambulance No.</th>
              <th className="px-5 py-3 border-b font-medium">Driver Info</th>
              <th className="px-5 py-3 border-b font-medium">Booking Time</th>
              <th className="px-5 py-3 border-b font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-blue-50 transition">
                <td className="px-5 py-3 text-gray-800">{b.id}</td>
                <td className="px-5 py-3 text-gray-800">{b.userEmail || b.user?.email}</td>
                <td className="px-5 py-3 text-gray-800">{b.hospitalName || b.hospital?.name}</td>
                <td className="px-5 py-3 text-gray-800">{b.ambulanceNumber || b.ambulance?.number}</td>
                <td className="px-5 py-3 text-gray-600">{b.ambulance?.driverInfo || '—'}</td>
                <td className="px-5 py-3 text-gray-600">
                  {b.bookingTime ? new Date(b.bookingTime).toLocaleString() : '—'}
                </td>
                <td className="px-5 py-3">
                  <select
                    className={`w-full px-3 py-2 rounded-md border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition
                      ${b.bookingStatus === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-300'
                        : b.bookingStatus === 'ACTIVE' ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-300'}`}
                    value={b.bookingStatus || b.status}
                    onChange={e => handleStatusChange(b.id, e.target.value)}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-gray-700 font-medium text-sm">
          Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
