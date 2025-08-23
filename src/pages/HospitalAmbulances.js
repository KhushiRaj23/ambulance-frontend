import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ambulanceApi, hospitalApi, bookingApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { 
  Truck, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Heart,
  Clock,
  Shield,
  Plus,
  X
} from 'lucide-react';

export default function HospitalAmbulances() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ambulances, setAmbulances] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [bookingData, setBookingData] = useState({
    bookingType: 'NORMAL',
    patient: { name: '', age: '', gender: '', condition: '' }
  });

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      hospitalApi.getAll().then(res => {
        const all = res.data.content || res.data;
        setHospital(all.find(h => String(h.id) === String(id)));
      }),
      ambulanceApi.getAvailable(id).then(res => setAmbulances(res.data))
    ])
      .catch(() => setError('Failed to fetch ambulances or hospital'))
      .finally(() => setLoading(false));
  }, [id]);

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
      case 'ON_DUTY': return <Clock className="w-4 h-4" />;
      case 'MAINTENANCE': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleBookAmbulance = (ambulance) => {
    setSelectedAmbulance(ambulance);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to book an ambulance');
      return;
    }

    const { name, age, gender, condition } = bookingData.patient;
    if (!name.trim() || !age || !gender || !condition.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await bookingApi.book(user.id, {
        hospitalId: Number(id),
        ambulanceId: Number(selectedAmbulance.id),
        bookingType: bookingData.bookingType,
        patient: {
          name: name.trim(),
          age: Number(age),
          gender,
          condition: condition.trim()
        }
      });

      setSuccess('Ambulance booked successfully!');
      setBookingData({
        bookingType: 'NORMAL',
        patient: { name: '', age: '', gender: '', condition: '' }
      });
      setShowBookingForm(false);
      setSelectedAmbulance(null);

      // Refresh ambulances list
      const res = await ambulanceApi.getAvailable(id);
      setAmbulances(res.data);

      setTimeout(() => navigate('/history'), 1500);
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableAmbulances = ambulances.filter(a => a.status === 'AVAILABLE');
  const onDutyAmbulances = ambulances.filter(a => a.status === 'ON_DUTY');

  if (loading && !hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/hospitals/nearest?lat=30.67129203873947&lng=74.3291273011156')}
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Hospitals</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {hospital ? hospital.name : 'Hospital'} Ambulances
            </h1>
            {hospital && (
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{hospital.address}</span>
              </div>
            )}
          </div>
        </div>

        <Notification type="error" message={error} />
        <Notification type="success" message={success} />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{ambulances.length}</div>
                <div className="text-sm text-gray-600">Total Ambulances</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{availableAmbulances.length}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{onDutyAmbulances.length}</div>
                <div className="text-sm text-gray-600">On Duty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambulances List */}
        <div className="space-y-6">
          {ambulances.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ambulances Found</h3>
              <p className="text-gray-600 mb-6">No ambulances are currently available at this hospital.</p>
            </div>
          ) : (
            ambulances.map(ambulance => (
              <div key={ambulance.id} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-900">#{ambulance.number}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${statusColor(ambulance.status)}`}>
                            {statusIcon(ambulance.status)}
                            <span className="ml-1">{ambulance.status}</span>
                          </span>
                        </div>
                        {ambulance.driverInfo && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <User className="w-4 h-4" />
                            <span>Driver: {ambulance.driverInfo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {ambulance.type && (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-gray-500">Type</div>
                            <div className="font-semibold text-gray-900">{ambulance.type}</div>
                          </div>
                        </div>
                      )}
                      
                      {ambulance.contactInfo && (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-gray-500">Contact</div>
                            <div className="font-semibold text-gray-900">{ambulance.contactInfo}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    {ambulance.status === 'AVAILABLE' ? (
                      <button
                        onClick={() => handleBookAmbulance(ambulance)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Book Now</span>
                      </button>
                    ) : (
                      <div className="text-sm text-gray-500 text-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <span>Not Available</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Booking Modal */}
        {showBookingForm && selectedAmbulance && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Book Ambulance</h3>
                    <p className="text-sm text-gray-600">#{selectedAmbulance.number}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Booking Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Booking Type *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                      bookingData.bookingType === 'NORMAL' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="NORMAL"
                        checked={bookingData.bookingType === 'NORMAL'}
                        onChange={e => setBookingData(b => ({ ...b, bookingType: e.target.value }))}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          bookingData.bookingType === 'NORMAL' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {bookingData.bookingType === 'NORMAL' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Normal</div>
                          <div className="text-sm text-gray-500">Regular medical transport</div>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                      bookingData.bookingType === 'EMERGENCY' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="EMERGENCY"
                        checked={bookingData.bookingType === 'EMERGENCY'}
                        onChange={e => setBookingData(b => ({ ...b, bookingType: e.target.value }))}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          bookingData.bookingType === 'EMERGENCY' ? 'border-red-500 bg-red-500' : 'border-gray-300'
                        }`}>
                          {bookingData.bookingType === 'EMERGENCY' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Emergency</div>
                          <div className="text-sm text-gray-500">Urgent medical care</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Patient Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Patient Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={bookingData.patient.name}
                          onChange={e => setBookingData(b => ({ ...b, patient: { ...b.patient, name: e.target.value } }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          placeholder="Enter patient name"
                          required
                        />
                      </div>
                    </div>

                    {/* Patient Age */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Patient Age *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          value={bookingData.patient.age}
                          onChange={e => setBookingData(b => ({ ...b, patient: { ...b.patient, age: e.target.value } }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          placeholder="Age"
                          min="0"
                          max="150"
                          required
                        />
                      </div>
                    </div>

                    {/* Patient Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender *
                      </label>
                      <select
                        value={bookingData.patient.gender}
                        onChange={e => setBookingData(b => ({ ...b, patient: { ...b.patient, gender: e.target.value } }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Patient Condition */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Medical Condition *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Heart className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={bookingData.patient.condition}
                          onChange={e => setBookingData(b => ({ ...b, patient: { ...b.patient, condition: e.target.value } }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                          placeholder="Describe the condition"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 ${
                      bookingData.bookingType === 'EMERGENCY' 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader size="sm" color="white" />
                        <span>Booking...</span>
                      </>
                    ) : (
                      <>
                        {bookingData.bookingType === 'EMERGENCY' ? (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            <span>Book Emergency Ambulance</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Book Ambulance</span>
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 