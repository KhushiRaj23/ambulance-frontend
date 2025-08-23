import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Truck, 
  Calendar, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Settings,
  Shield
} from 'lucide-react';
import { hospitalApi, ambulanceApi, adminApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalHospitals: 0,
    activeAmbulances: 0,
    todaysBookings: 0,
    registeredUsers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [ambulances, setAmbulances] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch all data in parallel
      const [hospitalsRes, ambulancesRes, bookingsRes] = await Promise.all([
        hospitalApi.getAll(0, 1000), // Get all hospitals
        ambulanceApi.getAll(),
        adminApi.getAllBookingsPaged(0, 10) // Get recent bookings
      ]);

      const hospitalsData = hospitalsRes.data.content || hospitalsRes.data || [];
      const ambulancesData = ambulancesRes.data || [];
      const bookingsData = bookingsRes.data.content || bookingsRes.data || [];

      // Debug: Log the first booking to see the data structure
      if (bookingsData.length > 0) {
        console.log('Sample booking data structure:', bookingsData[0]);
        console.log('Available user fields:', {
          userName: bookingsData[0].userName,
          user: bookingsData[0].user,
          userEmail: bookingsData[0].userEmail,
          userId: bookingsData[0].userId
        });
      }

      // Calculate statistics
      const totalHospitals = hospitalsData.length;
      const activeAmbulances = ambulancesData.filter(amb => amb.status === 'AVAILABLE').length;
      
      // Calculate today's bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaysBookings = bookingsData.filter(booking => {
        const bookingDate = new Date(booking.bookingTime);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      }).length;

      // For registered users, we'll use a placeholder since there's no direct API
      // In a real app, you'd have a user management API
      const registeredUsers = 1247; // This would come from user API

      setStats({
        totalHospitals,
        activeAmbulances,
        todaysBookings,
        registeredUsers
      });

      setAmbulances(ambulancesData);
      setRecentBookings(bookingsData.slice(0, 3)); // Show only 3 most recent

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Hospitals",
      value: stats.totalHospitals.toString(),
      change: "+2",
      icon: <Building2 className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Ambulances",
      value: stats.activeAmbulances.toString(),
      change: "+5",
      icon: <Truck className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Today's Bookings",
      value: stats.todaysBookings.toString(),
      change: "+3",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Registered Users",
      value: stats.registeredUsers.toLocaleString(),
      change: "+18",
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const quickActions = [
    {
      title: "Manage Hospitals",
      description: "Add, edit, or remove hospital information",
      icon: <Building2 className="w-8 h-8" />,
      link: "/admin/hospitals",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Manage Ambulances",
      description: "Track and manage ambulance fleet",
      icon: <Truck className="w-8 h-8" />,
      link: "/admin/ambulances",
      color: "from-green-500 to-green-600"
    },
    {
      title: "View All Bookings",
      description: "Monitor all ambulance bookings",
      icon: <Calendar className="w-8 h-8" />,
      link: "/admin/bookings",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: <Settings className="w-8 h-8" />,
      link: "#",
      color: "from-gray-500 to-gray-600"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'ACTIVE':
        return 'text-blue-600 bg-blue-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBookingStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ACTIVE':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size="xl" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Monitor and manage your ambulance service system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Online</span>
              </div>
            </div>
          </div>
        </div>

        <Notification type="error" message={error} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <div className="text-xs text-gray-500">vs last week</div>
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="group bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                <Link to="/admin/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentBookings.length === 0 ? (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent bookings</p>
                  </div>
                ) : (
                  recentBookings.map((booking, index) => {
                    // Debug: Log each booking's user data
                    console.log(`Booking ${index + 1} user data:`, {
                      userName: booking.userName,
                      user: booking.user,
                      userEmail: booking.userEmail,
                      userId: booking.userId
                    });

                    // Try to get the best available user name
                    let displayName = 'Unknown User';
                    
                    if (booking.userName) {
                      displayName = booking.userName;
                    } else if (booking.user?.name) {
                      displayName = booking.user.name;
                    } else if (booking.user?.username) {
                      displayName = booking.user.username;
                    } else if (booking.userEmail) {
                      displayName = booking.userEmail;
                    } else if (booking.user?.email) {
                      displayName = booking.user.email;
                    }

                    return (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-shrink-0">
                          {getBookingStatusIcon(booking.bookingStatus || booking.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {displayName}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(booking.bookingStatus || booking.status)}`}>
                              {booking.bookingStatus || booking.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {booking.hospitalName || booking.hospital?.name || 'Unknown Hospital'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {booking.bookingTime ? new Date(booking.bookingTime).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Database</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">API Services</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">GPS Tracking</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Notifications</span>
                  </div>
                  <span className="text-sm text-yellow-600 font-medium">Warning</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
      <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Ambulances</span>
                  <span className="font-semibold text-gray-900">{ambulances.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available Ambulances</span>
                  <span className="font-semibold text-green-600">{ambulances.filter(amb => amb.status === 'AVAILABLE').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">On Duty</span>
                  <span className="font-semibold text-blue-600">{ambulances.filter(amb => amb.status === 'ON_DUTY').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In Maintenance</span>
                  <span className="font-semibold text-red-600">{ambulances.filter(amb => amb.status === 'MAINTENANCE').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}