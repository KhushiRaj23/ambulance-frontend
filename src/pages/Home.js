import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ambulanceApi, hospitalApi } from '../api';
import Loader from '../components/Loader';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Shield, 
  Heart, 
  Truck, 
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Wifi,
  Battery
} from 'lucide-react';

function Home() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalAmbulances: 0,
    availableAmbulances: 0,
    totalHospitals: 0,
    totalBookings: 0,
    averageResponseTime: '8 min',
    serviceArea: '25 km',
    satisfaction: '98%'
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    // Debug: Log current user and token state
    console.log('Current user:', user);
    console.log('Current token:', user?.token);
    
    try {
      // Only fetch public data that doesn't require admin privileges
      let hospitalsData = [];
      try {
        console.log('Attempting to fetch hospitals...');
        const hospitalsRes = await hospitalApi.getAll();
        console.log('Hospitals response:', hospitalsRes);
        hospitalsData = hospitalsRes.data.content || hospitalsRes.data || [];
      } catch (hospitalErr) {
        console.log('Hospital data not accessible:', hospitalErr);
        console.log('Hospital error response:', hospitalErr.response);
        hospitalsData = [];
      }
      
      // For ambulances, try multiple strategies to get accurate counts
      let ambulancesData = [];
      let totalBookings = 0;
      
      try {
        // Strategy 1: Try to get all available ambulances across all hospitals
        try {
          console.log('Attempting to fetch all available ambulances...');
          const allAvailableRes = await ambulanceApi.getAllAvailable();
          console.log('All available ambulances response:', allAvailableRes);
          ambulancesData = allAvailableRes.data || [];
        } catch (allAvailableErr) {
          console.log('All available ambulances endpoint not accessible, trying individual hospitals...');
          
          // Strategy 2: If that fails, try to get ambulances from all hospitals
          if (hospitalsData.length > 0) {
            const allAmbulancesPromises = hospitalsData.map(async (hospital) => {
              try {
                const hospitalAmbulancesRes = await ambulanceApi.getAvailable(hospital.id);
                return hospitalAmbulancesRes.data || [];
              } catch (err) {
                console.log(`Failed to fetch ambulances for hospital ${hospital.id}:`, err);
                return [];
              }
            });
            
            const allHospitalAmbulances = await Promise.all(allAmbulancesPromises);
            ambulancesData = allHospitalAmbulances.flat();
            console.log('Combined ambulances from all hospitals:', ambulancesData);
          }
        }
      } catch (ambulanceErr) {
        console.log('All ambulance fetching strategies failed:', ambulanceErr);
        console.log('Ambulance error response:', ambulanceErr.response);
        // Use default values if ambulance data is not accessible
        ambulancesData = [];
      }

      // Calculate statistics with better status handling
      const totalAmbulances = ambulancesData.length;
      
      // Handle different possible status values and normalize them
      const availableAmbulances = ambulancesData.filter(amb => {
        const status = amb.status?.toString().toLowerCase();
        return status === 'available' || status === 'ready' || status === 'free' || status === 'idle';
      }).length;
      
      const totalHospitals = hospitalsData.length;
      
      console.log('Ambulance statistics:', {
        total: totalAmbulances,
        available: availableAmbulances,
        data: ambulancesData,
        statusBreakdown: ambulancesData.reduce((acc, amb) => {
          const status = amb.status?.toString().toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {})
      });
      
      // Use default values for admin-only data
      const averageResponseTime = '8 min';
      const serviceArea = '25 km';
      const satisfaction = '98%';

      setStats({
        totalAmbulances,
        availableAmbulances,
        totalHospitals,
        totalBookings,
        averageResponseTime,
        serviceArea,
        satisfaction
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      
      // Provide more specific error messages based on the error
      if (err.response?.status === 403) {
        setError('Access denied. Some data may not be available.');
      } else if (err.response?.status === 401) {
        setError('Please log in to view complete dashboard data.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('Failed to load dashboard data. Using default values.');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchPublicData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch only public data that doesn't require authentication
      let hospitalsData = [];
      try {
        console.log('Fetching public hospital data...');
        const hospitalsRes = await hospitalApi.getAll();
        hospitalsData = hospitalsRes.data.content || hospitalsRes.data || [];
      } catch (hospitalErr) {
        console.log('Public hospital data not accessible:', hospitalErr);
        hospitalsData = [];
      }
      
      // Try to get ambulance data for public users
      let ambulancesData = [];
      try {
        if (hospitalsData.length > 0) {
          // Try to get ambulances from the first few hospitals
          const hospitalsToCheck = hospitalsData.slice(0, 3); // Check first 3 hospitals
          const ambulancePromises = hospitalsToCheck.map(async (hospital) => {
            try {
              const res = await ambulanceApi.getAvailable(hospital.id);
              return res.data || [];
            } catch (err) {
              return [];
            }
          });
          
          const hospitalAmbulances = await Promise.all(ambulancePromises);
          ambulancesData = hospitalAmbulances.flat();
        }
      } catch (ambulanceErr) {
        console.log('Public ambulance data not accessible:', ambulanceErr);
        ambulancesData = [];
      }

      // Calculate public statistics with better status handling
      const totalAmbulances = ambulancesData.length;
      
      // Handle different possible status values and normalize them
      const availableAmbulances = ambulancesData.filter(amb => {
        const status = amb.status?.toString().toLowerCase();
        return status === 'available' || status === 'ready' || status === 'free' || status === 'idle';
      }).length;
      
      const totalHospitals = hospitalsData.length;
      
      console.log('Public data statistics:', {
        total: totalAmbulances,
        available: availableAmbulances,
        hospitals: totalHospitals,
        statusBreakdown: ambulancesData.reduce((acc, amb) => {
          const status = amb.status?.toString().toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {})
      });

      setStats({
        totalAmbulances,
        availableAmbulances,
        totalHospitals,
        totalBookings: 0, // Not available for public users
        averageResponseTime: '8 min',
        serviceArea: '25 km',
        satisfaction: '98%'
      });

    } catch (err) {
      console.error('Error fetching public data:', err);
      setError('Unable to load public data. Please try again later.');
      
      // Set default stats on error
      setStats({
        totalAmbulances: 0,
        availableAmbulances: 0,
        totalHospitals: 0,
        totalBookings: 0,
        averageResponseTime: '8 min',
        serviceArea: '25 km',
        satisfaction: '98%'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Try to fetch data regardless of authentication status for public information
    if (user) {
      fetchDashboardData();
    } else {
      // For non-authenticated users, still try to fetch public data
      fetchPublicData();
    }
  }, [user, fetchDashboardData, fetchPublicData]);

  const handleEmergencyCall = () => {
    window.open('tel:911', '_self');
  };

  const services = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Book Ambulance",
      description: "Quick and reliable ambulance booking service",
      color: "from-blue-500 to-blue-600",
      link: "/booking"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Find Hospitals",
      description: "Locate nearest hospitals and medical facilities",
      color: "from-teal-500 to-teal-600",
      link: "/hospitals/nearest"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Track Status",
      description: "Real-time tracking of your ambulance",
      color: "from-purple-500 to-purple-600",
      link: "/history"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Emergency Helpline",
      description: "24/7 emergency support and assistance",
      color: "from-red-500 to-red-600",
      link: "#"
    }
  ];

  const statsDisplay = [
    { label: "Active Ambulances", value: stats.totalAmbulances.toString(), icon: <Truck className="w-5 h-5" /> },
    { label: "Response Time", value: stats.averageResponseTime, icon: <Clock className="w-5 h-5" /> },
    { label: "Hospitals", value: stats.totalHospitals.toString(), icon: <MapPin className="w-5 h-5" /> },
    { label: "Satisfaction", value: stats.satisfaction, icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  <span>Trusted Healthcare Partner</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Emergency Care
                  <span className="text-blue-600 block">When You Need It</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Fast, reliable ambulance services with professional medical staff. 
                  Available 24/7 for emergency and non-emergency medical transport.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleEmergencyCall}
                  className="flex items-center justify-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Emergency</span>
                </button>
                {user && (
                  <Link
                    to="/booking"
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span>Book Ambulance</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
                {!user && (
                  <Link
                    to="/register"
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                  <div className="flex space-x-2">
                    {user && (
                      <button
                        onClick={fetchDashboardData}
                        className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
                      >
                        Retry
                      </button>
                    )}
                    {!user && (
                      <button
                        onClick={fetchPublicData}
                        className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Success message for ambulance data */}
              {!loading && !error && stats.totalAmbulances > 0 && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {stats.availableAmbulances} of {stats.totalAmbulances} ambulances are currently available
                    </span>
                  </div>
                  <button
                    onClick={user ? fetchDashboardData : fetchPublicData}
                    className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              )}

              {/* Info for non-authenticated users */}
              {!user && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-medium">Log in to view complete dashboard data and access all features.</span>
                  </div>
                  <button
                    onClick={fetchPublicData}
                    className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {statsDisplay.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {loading ? <Loader size="sm" /> : stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Live Status</h3>
                      <p className="text-blue-100">Real-time ambulance availability</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Available Ambulances</span>
                      <span className="font-semibold">
                        {loading ? <Loader size="sm" color="white" /> : stats.availableAmbulances}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Response</span>
                      <span className="font-semibold">{stats.averageResponseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Service Area</span>
                      <span className="font-semibold">{stats.serviceArea}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive emergency medical services designed for your safety and peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Status Widget */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Status</h2>
                <p className="text-gray-600">Real-time ambulance availability and response times</p>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Live</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Available</h3>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {loading ? <Loader size="sm" /> : stats.availableAmbulances}
                </div>
                <p className="text-green-700">Ambulances ready</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.averageResponseTime}</div>
                <p className="text-blue-700">Average arrival</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Coverage</h3>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.serviceArea}</div>
                <p className="text-purple-700">Service radius</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Last updated: {currentTime.toLocaleTimeString()}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Wifi className="w-4 h-4" />
                    <span>Connected</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Battery className="w-4 h-4" />
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">PulseRide</span>
              </div>
              <p className="text-gray-400">
                Trusted emergency medical services available 24/7 for your safety and peace of mind.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/booking" className="text-gray-400 hover:text-white transition-colors">Book Ambulance</Link></li>
                <li><Link to="/hospitals/nearest" className="text-gray-400 hover:text-white transition-colors">Find Hospitals</Link></li>
                <li><Link to="/history" className="text-gray-400 hover:text-white transition-colors">Booking History</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400">911</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400">Emergency Line</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400">Medical Support</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@pulseride.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Medical Center Dr</li>
                <li>Hours: 24/7 Available</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PulseRide (khushi Raj). All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 