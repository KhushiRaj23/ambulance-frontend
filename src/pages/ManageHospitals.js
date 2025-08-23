import React, { useEffect, useState } from 'react';
import { hospitalApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Search,
  Filter,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ManageHospitals() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    contactInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toRemove, setToRemove] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hospitalsPerPage] = useState(5);

  const fetchHospitals = () => {
    setLoading(true);
    setError('');
    hospitalApi
      .getAll()
      .then(res => {
        const hospitalsData = res.data.content || res.data;
        setHospitals(hospitalsData);
      })
      .catch(() => setError('Failed to fetch hospitals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const addHospital = async e => {
    e.preventDefault();
    if (!newHospital.name.trim() || !newHospital.address.trim() || newHospital.latitude === '' || newHospital.longitude === '') {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await hospitalApi.add({
        name: newHospital.name,
        address: newHospital.address,
        latitude: parseFloat(newHospital.latitude),
        longitude: parseFloat(newHospital.longitude),
        contactInfo: newHospital.contactInfo
      });
      setSuccess('Hospital added successfully!');
      setNewHospital({ name: '', address: '', latitude: '', longitude: '', contactInfo: '' });
      setShowAddForm(false);
      setCurrentPage(1); // Reset to first page after adding
      fetchHospitals();
    } catch {
      setError('Failed to add hospital');
    } finally {
      setLoading(false);
    }
  };

  const confirmRemove = id => {
    setToRemove(id);
    setShowConfirm(true);
  };

  const removeHospital = async () => {
    setRemovingId(toRemove);
    setShowConfirm(false);
    setError('');
    setSuccess('');
    try {
      await hospitalApi.remove(toRemove);
      setSuccess('Hospital removed successfully!');
      fetchHospitals();
      // Adjust current page if we're on the last page and it becomes empty
      const filteredHospitals = hospitals.filter(h => h.id !== toRemove);
      const maxPage = Math.ceil(filteredHospitals.length / hospitalsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch {
      setError('Failed to remove hospital');
    } finally {
      setRemovingId(null);
      setToRemove(null);
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastHospital = currentPage * hospitalsPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
  const currentHospitals = filteredHospitals.slice(indexOfFirstHospital, indexOfLastHospital);
  const totalPages = Math.ceil(filteredHospitals.length / hospitalsPerPage);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
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
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Add Hospital</span>
            </button>
          </div>
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Hospitals</h1>
            <p className="text-gray-600">Add, edit, and manage hospital information in your system</p>
          </div>
        </div>

        <Notification type="error" message={error} />
        <Notification type="success" message={success} />

        {/* Add Hospital Form */}
        {showAddForm && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Hospital</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={addHospital} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hospital Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter hospital name"
                      value={newHospital.name}
                      onChange={e => setNewHospital(h => ({ ...h, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Information
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Phone number or email"
                      value={newHospital.contactInfo}
                      onChange={e => setNewHospital(h => ({ ...h, contactInfo: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter full address"
                    value={newHospital.address}
                    onChange={e => setNewHospital(h => ({ ...h, address: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="any"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Latitude coordinate"
                      value={newHospital.latitude}
                      onChange={e => setNewHospital(h => ({ ...h, latitude: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="any"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Longitude coordinate"
                      value={newHospital.longitude}
                      onChange={e => setNewHospital(h => ({ ...h, longitude: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader size="sm" color="white" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add Hospital</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search hospitals by name or address..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 px-4 py-3 rounded-xl">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Filter</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstHospital + 1}-{Math.min(indexOfLastHospital, filteredHospitals.length)} of {filteredHospitals.length} hospitals
            </div>
          </div>
        </div>

        {/* Hospitals List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="xl" />
          </div>
        ) : (
          <div className="space-y-6">
            {currentHospitals.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hospitals Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'No hospitals match your search criteria.' : 'No hospitals have been added yet.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add First Hospital</span>
                  </button>
                )}
              </div>
            ) : (
              currentHospitals.map(hospital => (
                <div key={hospital.id} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{hospital.address}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">Latitude:</span>
                          <span className="font-medium text-gray-900">{hospital.latitude}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">Longitude:</span>
                          <span className="font-medium text-gray-900">{hospital.longitude}</span>
                        </div>
                        {hospital.contactInfo && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{hospital.contactInfo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => confirmRemove(hospital.id)}
                      disabled={removingId === hospital.id}
                      className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200 ml-4"
                    >
                      {removingId === hospital.id ? (
                        <>
                          <Loader size="sm" color="red" />
                          <span>Removing...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {getPageNumbers().map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Removal</h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to remove this hospital from the system?
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={removeHospital}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Hospital</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}