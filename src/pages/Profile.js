import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Notification from '../components/Notification';

export default function Profile() {
  const { user, loading, error, fetchProfile } = useAuth();

  useEffect(() => {
    if (user && user.id) {
      fetchProfile(user.id);
    }
    // eslint-disable-next-line
  }, []); // Only run on mount

  if (loading && !user) return <Loader />;

  if (!user) {
    return (
      <div className="text-center mt-20 text-lg text-red-600 font-semibold">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">User Profile</h2>

      {error && <Notification type="error" message={error} />}

      <div className="space-y-5">
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Latitude" value={user.lat || user.latitude || 'N/A'} />
        <ProfileField label="Longitude" value={user.lng || user.longitude || 'N/A'} />
        <ProfileField label="Role" value={user.role} />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-md">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}
