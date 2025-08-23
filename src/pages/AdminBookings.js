import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  ArrowLeft,
  Search,
  User,
  Building2,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
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
      setSuccess('Booking status updated successfully!');
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toString().includes(searchTerm) ||
      (booking.userEmail && booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.hospitalName && booking.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.ambulanceNumber && booking.ambulanceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || booking.bookingStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };



  const stats = {
    total: bookings.length,
    active: bookings.filter(b => b.bookingStatus === 'ACTIVE').length,
    completed: bookings.filter(b => b.bookingStatus === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.bookingStatus === 'CANCELLED').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
      <button
        onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
      >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
      </button>
            </div>
          </div>
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Bookings</h1>
            <p className="text-gray-600">Monitor and manage all ambulance bookings across the system</p>
          </div>
        </div>

        <Notification type="error" message={error} />
        <Notification type="success" message={success} />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings by ID, user, hospital, or ambulance..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="xl" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Booking Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hospital
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ambulance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Booking Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
            </tr>
          </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                        <p className="text-gray-600">
                          {searchTerm || statusFilter !== 'ALL' ? 'No bookings match your search criteria.' : 'No bookings have been made yet.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-semibold text-gray-900">#{booking.id}</div>
                              <div className="text-xs text-gray-500">Booking ID</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.userEmail || booking.user?.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.hospitalName || booking.hospital?.name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Truck className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.ambulanceNumber || booking.ambulance?.number || 'N/A'}
                              </div>
                              {booking.ambulance?.driverInfo && (
                                <div className="text-xs text-gray-500">
                                  {booking.ambulance.driverInfo}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Clock className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.bookingTime ? new Date(booking.bookingTime).toLocaleDateString() : 'N/A'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {booking.bookingTime ? new Date(booking.bookingTime).toLocaleTimeString() : ''}
                              </div>
                            </div>
                          </div>
                </td>
                        <td className="px-6 py-4">
                  <select
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${getStatusColor(booking.bookingStatus || booking.status)}`}
                            value={booking.bookingStatus || booking.status}
                            onChange={e => handleStatusChange(booking.id, e.target.value)}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">View</span>
                          </button>
                        </td>
              </tr>
                    ))
                  )}
          </tbody>
        </table>
      </div>
          </div>
        )}

      {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
        </button>
                );
              })}
            </div>
            
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">User Information</span>
                    </div>
                    <p className="text-gray-700">{selectedBooking.userEmail || selectedBooking.user?.email || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Building2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">Hospital</span>
                    </div>
                    <p className="text-gray-700">{selectedBooking.hospitalName || selectedBooking.hospital?.name || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Truck className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">Ambulance</span>
                    </div>
                    <p className="text-gray-700">{selectedBooking.ambulanceNumber || selectedBooking.ambulance?.number || 'N/A'}</p>
                    {selectedBooking.ambulance?.driverInfo && (
                      <p className="text-sm text-gray-500 mt-1">Driver: {selectedBooking.ambulance.driverInfo}</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-gray-900">Booking Time</span>
                    </div>
                    <p className="text-gray-700">
                      {selectedBooking.bookingTime ? new Date(selectedBooking.bookingTime).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Close
        </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
