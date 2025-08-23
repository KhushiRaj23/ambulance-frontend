import React, { useEffect, useState } from 'react';
import { ambulanceApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { hospitalApi } from '../api';
import { 
  Truck, 
  Building2, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Search,
  AlertTriangle,
  CheckCircle,
  X,
  User,
  Phone,
  MapPin,
  Activity,
  Settings,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ManageAmbulances() {
  const navigate = useNavigate();
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [newAmbulance, setNewAmbulance] = useState({
    number: '',
    status: 'AVAILABLE',
    hospitalId: '',
    driverInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toRemove, setToRemove] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ambulancesPerPage] = useState(5);

  const fetchAmbulances = () => {
    setLoading(true);
    setError('');
    ambulanceApi
      .getAll()
      .then(res => {
        const ambulancesData = res.data;
        setAmbulances(ambulancesData);
      })
      .catch(() => setError('Failed to fetch ambulances'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAmbulances();
    // Fetch hospitals for dropdown
    hospitalApi.getAll().then(res => {
      setHospitals(res.data.content || res.data);
    });
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const addAmbulance = async e => {
    e.preventDefault();
    if (!newAmbulance.number.trim() || !newAmbulance.status || !newAmbulance.hospitalId) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await ambulanceApi.add({
        number: newAmbulance.number,
        status: newAmbulance.status,
        hospital: { id: Number(newAmbulance.hospitalId) },
        driverInfo: newAmbulance.driverInfo
      });
      setSuccess('Ambulance added successfully!');
      setNewAmbulance({ number: '', status: 'AVAILABLE', hospitalId: '', driverInfo: '' });
      setShowAddForm(false);
      setCurrentPage(1); // Reset to first page after adding
      fetchAmbulances();
    } catch {
      setError('Failed to add ambulance');
    } finally {
      setLoading(false);
    }
  };

  const confirmRemove = id => {
    setToRemove(id);
    setShowConfirm(true);
  };

  const removeAmbulance = async () => {
    setRemovingId(toRemove);
    setShowConfirm(false);
    setError('');
    setSuccess('');
    try {
      await ambulanceApi.remove(toRemove);
      setSuccess('Ambulance removed successfully!');
      fetchAmbulances();
      // Adjust current page if we're on the last page and it becomes empty
      const filteredAmbulances = ambulances.filter(a => a.id !== toRemove);
      const maxPage = Math.ceil(filteredAmbulances.length / ambulancesPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }
    } catch {
      setError('Failed to remove ambulance');
    } finally {
      setRemovingId(null);
      setToRemove(null);
    }
  };

  const toggleStatus = async (id, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await ambulanceApi.changeStatus(id, status === 'AVAILABLE' ? 'ON_DUTY' : 'AVAILABLE');
      setSuccess('Ambulance status changed successfully!');
      fetchAmbulances();
    } catch {
      setError('Failed to change status');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = status => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800 border-green-300';
      case 'ON_DUTY': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'MAINTENANCE': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusIcon = status => {
    switch (status) {
      case 'AVAILABLE': return <CheckCircle className="w-4 h-4" />;
      case 'ON_DUTY': return <Activity className="w-4 h-4" />;
      case 'MAINTENANCE': return <Settings className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const grouped = ambulances.reduce((acc, a) => {
    const hospitalName = a.hospitalName || (a.hospital && a.hospital.name) || 'Unknown Hospital';
    const hospitalKey = hospitalName + (a.hospital?.address ? ' - ' + a.hospital.address : '');
    if (!acc[hospitalKey]) acc[hospitalKey] = [];
    acc[hospitalKey].push(a);
    return acc;
  }, {});

  const filteredAmbulances = Object.entries(grouped).reduce((acc, [hospitalKey, ambs]) => {
    const filteredAmbs = ambs.filter(amb => {
      const matchesSearch = amb.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (amb.driverInfo && amb.driverInfo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'ALL' || amb.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    if (filteredAmbs.length > 0) {
      acc[hospitalKey] = filteredAmbs;
    }
    return acc;
  }, {});

  // Flatten all ambulances for pagination
  const allFilteredAmbulances = Object.values(filteredAmbulances).flat();

  // Pagination logic
  const indexOfLastAmbulance = currentPage * ambulancesPerPage;
  const indexOfFirstAmbulance = indexOfLastAmbulance - ambulancesPerPage;
  const currentAmbulances = allFilteredAmbulances.slice(indexOfFirstAmbulance, indexOfLastAmbulance);
  const totalPages = Math.ceil(allFilteredAmbulances.length / ambulancesPerPage);

  // Reset to first page when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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

  // Group current ambulances by hospital for display
  const currentGroupedAmbulances = currentAmbulances.reduce((acc, ambulance) => {
    const hospitalName = ambulance.hospitalName || (ambulance.hospital && ambulance.hospital.name) || 'Unknown Hospital';
    const hospitalKey = hospitalName + (ambulance.hospital?.address ? ' - ' + ambulance.hospital.address : '');
    if (!acc[hospitalKey]) acc[hospitalKey] = [];
    acc[hospitalKey].push(ambulance);
    return acc;
  }, {});

  const stats = {
    total: ambulances.length,
    available: ambulances.filter(a => a.status === 'AVAILABLE').length,
    onDuty: ambulances.filter(a => a.status === 'ON_DUTY').length,
    maintenance: ambulances.filter(a => a.status === 'MAINTENANCE').length
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
              <span>Add Ambulance</span>
            </button>
          </div>
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Ambulances</h1>
            <p className="text-gray-600">Track and manage your ambulance fleet across all hospitals</p>
          </div>
        </div>

        <Notification type="error" message={error} />
        <Notification type="success" message={success} />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.available}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.onDuty}</div>
                <div className="text-sm text-gray-600">On Duty</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.maintenance}</div>
                <div className="text-sm text-gray-600">Maintenance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Ambulance Form */}
        {showAddForm && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Ambulance</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={addAmbulance} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ambulance Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Truck className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter ambulance number"
                      value={newAmbulance.number}
                      onChange={e => setNewAmbulance(a => ({ ...a, number: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    value={newAmbulance.status}
                    onChange={e => setNewAmbulance(a => ({ ...a, status: e.target.value }))}
                    required
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_DUTY">On Duty</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hospital *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      value={newAmbulance.hospitalId}
                      onChange={e => setNewAmbulance(a => ({ ...a, hospitalId: e.target.value }))}
                      required
                    >
                      <option value="">Select hospital</option>
                      {hospitals.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Driver Information
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Driver name and contact"
                      value={newAmbulance.driverInfo}
                      onChange={e => setNewAmbulance(a => ({ ...a, driverInfo: e.target.value }))}
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
                      <span>Add Ambulance</span>
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
                  placeholder="Search ambulances by number or driver..."
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
                <option value="AVAILABLE">Available</option>
                <option value="ON_DUTY">On Duty</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstAmbulance + 1}-{Math.min(indexOfLastAmbulance, allFilteredAmbulances.length)} of {allFilteredAmbulances.length} ambulances
            </div>
          </div>
        </div>

        {/* Ambulances List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="xl" />
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(currentGroupedAmbulances).length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ambulances Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'ALL' ? 'No ambulances match your search criteria.' : 'No ambulances have been added yet.'}
                </p>
                {!searchTerm && statusFilter === 'ALL' && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add First Ambulance</span>
                  </button>
                )}
              </div>
            ) : (
              Object.entries(currentGroupedAmbulances).map(([hospitalKey, ambs]) => (
                <div key={hospitalKey} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{hospitalKey.split(' - ')[0]}</h3>
                      {hospitalKey.split(' - ')[1] && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{hospitalKey.split(' - ')[1]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {ambs.map(ambulance => (
                      <div key={ambulance.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                              <Truck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900">#{ambulance.number}</div>
                              <div className="text-sm text-gray-500">{ambulance.name}</div>
                            </div>
                          </div>
                          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-medium ${statusColor(ambulance.status)}`}>
                            {statusIcon(ambulance.status)}
                            <span>{ambulance.status}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {ambulance.type && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className="font-medium">Type:</span>
                              <span>{ambulance.type}</span>
                            </div>
                          )}
                          {ambulance.driver && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{ambulance.driver}</span>
                            </div>
                          )}
                          {ambulance.contactInfo && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{ambulance.contactInfo}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleStatus(ambulance.id, ambulance.status)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 text-white py-2 px-3 rounded-xl hover:bg-gray-900 transition-all duration-200 text-sm font-medium"
                            disabled={removingId === ambulance.id}
                          >
                            <Activity className="w-4 h-4" />
                            <span>Toggle Status</span>
                          </button>
                          <button
                            onClick={() => confirmRemove(ambulance.id)}
                            className="flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-2 px-3 rounded-xl hover:bg-red-100 transition-all duration-200"
                            disabled={removingId === ambulance.id}
                          >
                            {removingId === ambulance.id ? (
                              <Loader size="sm" color="red" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
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
                Are you sure you want to remove this ambulance from the system?
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={removeAmbulance}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Ambulance</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}