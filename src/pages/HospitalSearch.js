import React, { useEffect, useState } from 'react';
import { hospitalApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Navigation, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  Truck,
  Heart,
  Shield
} from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function HospitalSearch() {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const query = useQuery();
  const lat = query.get('lat');
  const lng = query.get('lng');

  useEffect(() => {
    // If lat/lng are not in query, but user has them, redirect to correct URL
    if (!lat || !lng) {
      if (user && user.latitude && user.longitude) {
        navigate(`/hospitals/nearest?lat=${user.latitude}&lng=${user.longitude}`, { replace: true });
      } else {
        setError('Location not available. Please update your profile with your location.');
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError('');
    hospitalApi
      .getNearest(lat, lng)
      .then(res => setHospitals(res.data))
      .catch(() => setError('Failed to fetch nearby hospitals'))
      .finally(() => setLoading(false));
  }, [lat, lng, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
          <Notification type="error" message={error} />
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Required</h3>
            <p className="text-gray-600 mb-6">Please update your profile with your location to find nearby hospitals.</p>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 mx-auto"
            >
              <Shield className="w-5 h-5" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>
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
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nearby Hospitals</h1>
            <p className="text-gray-600">Find the closest hospitals to your location for emergency care</p>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Your Location</div>
              <div className="text-lg font-semibold text-gray-900">
                {lat && lng ? `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}` : 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        {/* Hospitals List */}
        <div className="space-y-6">
          {hospitals.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hospitals Found</h3>
              <p className="text-gray-600 mb-6">No hospitals found in your area. Please try updating your location.</p>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 mx-auto"
              >
                <Shield className="w-5 h-5" />
                <span>Update Location</span>
              </button>
            </div>
          ) : (
            hospitals.map((hospital, index) => (
              <div key={hospital.id} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
                          {index === 0 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                              <Navigation className="w-3 h-3 mr-1" />
                              Closest
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{hospital.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Navigation className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-gray-500">Distance</div>
                          <div className="font-semibold text-gray-900">
                            {hospital.distance ? `${hospital.distance.toFixed(1)} km` : 'Unknown'}
                          </div>
                        </div>
                      </div>
                      
                      {hospital.contactInfo && (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-gray-500">Contact</div>
                            <div className="font-semibold text-gray-900">{hospital.contactInfo}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-gray-500">Ambulances</div>
                          <div className="font-semibold text-gray-900">Available</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => navigate(`/hospitals/${hospital.id}/ambulances`)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span>View Ambulances</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-red-100 rounded-3xl p-6 border border-red-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-1">Emergency Contact</h3>
              <p className="text-red-700">For immediate medical emergencies, call your local emergency number (112/911)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}