import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';
import Notification from './components/Notification';
import { 
  User, 
  Mail, 
  MapPin, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Phone,
  Calendar,
  Key,
  CheckCircle
} from 'lucide-react';

export default function Profile() {
  const { user, loading, error, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: '', latitude: '', longitude: '', password: '' });
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ 
        email: user.email || '', 
        latitude: user.latitude || '', 
        longitude: user.longitude || '', 
        password: '' 
      });
    }
  }, [user]);

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({ 
      email: user.email || '', 
      latitude: user.latitude || '', 
      longitude: user.longitude || '', 
      password: '' 
    });
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      email: form.email || user.email,
    };
    
    if (!isAdmin) {
      updateData.latitude = form.latitude || user.latitude;
      updateData.longitude = form.longitude || user.longitude;
    }
    
    if (form.password) updateData.password = form.password;
    const res = await updateProfile(updateData);
    if (res.success) {
      setSuccess('Profile updated successfully!');
      setEditing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size="xl" />
    </div>
  );
  
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Not Logged In</h2>
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
                {!editing && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <Notification type="error" message={error} />
              {success && <Notification type="success" message={success} />}

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Location Fields for non-admin users */}
                  {!isAdmin && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Latitude
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="latitude"
                            value={form.latitude}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Latitude"
                            step="any"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Longitude
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="longitude"
                            value={form.longitude}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            placeholder="Longitude"
                            step="any"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password (leave blank to keep unchanged)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Username</span>
                      </div>
                      <p className="text-gray-700">{user.username ?? 'N/A'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Email</span>
                      </div>
                      <p className="text-gray-700">{user.email ?? 'N/A'}</p>
                    </div>

                    {!isAdmin && (
                      <>
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex items-center space-x-3 mb-3">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">Latitude</span>
                          </div>
                          <p className="text-gray-700">{user.latitude ?? 'N/A'}</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6">
                          <div className="flex items-center space-x-3 mb-3">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-900">Longitude</span>
                          </div>
                          <p className="text-gray-700">{user.longitude ?? 'N/A'}</p>
                        </div>
                      </>
                    )}

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Role</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{user.role ?? 'N/A'}</span>
                        {isAdmin && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Member Since</span>
                      </div>
                      <p className="text-gray-700">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-gray-900 font-medium">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Complete</span>
                  <span className="text-blue-600 font-medium">100%</span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Security Settings</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Contact Support</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Privacy Policy</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}