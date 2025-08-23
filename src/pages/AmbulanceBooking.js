import React, { useState, useEffect } from 'react';
import { hospitalApi, ambulanceApi, bookingApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Building2, 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Heart
} from 'lucide-react';

export default function AmbulanceBooking() {
  const { user } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);

  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [bookingType, setBookingType] = useState('NORMAL');
  const [patient, setPatient] = useState({ name: '', age: '', gender: '', condition: '' });

  const navigate = useNavigate();

  useEffect(() => {
    hospitalApi.getAll().then(res => {
      setHospitals(res.data.content || res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      ambulanceApi.getAvailable(selectedHospital).then(res => {
        setAmbulances(res.data);
      });
    } else {
      setAmbulances([]);
    }
    setSelectedAmbulance('');
  }, [selectedHospital]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const { name, age, gender, condition } = patient;

    if (!selectedHospital || !selectedAmbulance || !name.trim() || !age || !gender || !condition.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      await bookingApi.book(user.id, {
        hospitalId: Number(selectedHospital),
        ambulanceId: Number(selectedAmbulance),
        bookingType,
        patient: {
          name: name.trim(),
          age: Number(age),
          gender,
          condition: condition.trim()
        }
      });

      setSuccess('Ambulance booked successfully!');
      setPatient({ name: '', age: '', gender: '', condition: '' });
      setBookingType('NORMAL');
      setSelectedHospital('');
      setSelectedAmbulance('');

      setTimeout(() => navigate('/history'), 1500);
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Ambulance</h1>
            <p className="text-gray-600">Quick and reliable ambulance booking for emergency medical care</p>
          </div>
        </div>

        <Notification type="error" message={error} />
        <Notification type="success" message={success} />

        {/* Booking Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Hospital *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedHospital}
                  onChange={e => setSelectedHospital(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                >
                  <option value="">Choose a hospital</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ambulance Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Ambulances *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Truck className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedAmbulance}
                  onChange={e => setSelectedAmbulance(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white disabled:opacity-50"
                  disabled={!selectedHospital}
                  required
                >
                  <option value="">{selectedHospital ? 'Select an ambulance' : 'Select hospital first'}</option>
                  {ambulances.map(a => (
                    <option key={a.id} value={a.id}>
                      #{a.number} {a.driverInfo ? `- ${a.driverInfo}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {selectedHospital && ambulances.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No ambulances available at this hospital</p>
              )}
            </div>

            {/* Booking Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Booking Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                  bookingType === 'NORMAL' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="NORMAL"
                    checked={bookingType === 'NORMAL'}
                    onChange={e => setBookingType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      bookingType === 'NORMAL' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {bookingType === 'NORMAL' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Normal</div>
                      <div className="text-sm text-gray-500">Regular medical transport</div>
                    </div>
                  </div>
                </label>
                
                <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                  bookingType === 'EMERGENCY' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="EMERGENCY"
                    checked={bookingType === 'EMERGENCY'}
                    onChange={e => setBookingType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      bookingType === 'EMERGENCY' ? 'border-red-500 bg-red-500' : 'border-gray-300'
                    }`}>
                      {bookingType === 'EMERGENCY' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
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
                      value={patient.name}
                      onChange={e => setPatient(p => ({ ...p, name: e.target.value }))}
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
                      value={patient.age}
                      onChange={e => setPatient(p => ({ ...p, age: e.target.value }))}
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
                    value={patient.gender}
                    onChange={e => setPatient(p => ({ ...p, gender: e.target.value }))}
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
                      value={patient.condition}
                      onChange={e => setPatient(p => ({ ...p, condition: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Describe the condition"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  bookingType === 'EMERGENCY' 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader size="sm" color="white" />
                    <span>Booking Ambulance...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    {bookingType === 'EMERGENCY' ? (
                      <>
                        <AlertTriangle className="w-5 h-5" />
                        <span>Book Emergency Ambulance</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Book Ambulance</span>
                      </>
                    )}
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
