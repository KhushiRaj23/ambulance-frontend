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
  }, []);

  if (loading) return <Loader />;
  if (!user) return <div className="text-center mt-10 text-red-600">Not logged in.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">User Profile</h2>
      <Notification type="error" message={error} />
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-3">
          <span className="font-medium">Username:</span> {user.username ?? 'N/A'}
        </div>
        <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-3">
          <span className="font-medium">Email:</span> {user.email ?? 'N/A'}
        </div>
        <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-3">
          <span className="font-medium">Latitude:</span> {user.latitude ?? 'N/A'}
        </div>
        <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-3">
          <span className="font-medium">Longitude:</span> {user.longitude ?? 'N/A'}
        </div>
        <div className="flex justify-between items-center bg-gray-50 rounded px-4 py-3">
          <span className="font-medium">Role:</span> {user.role ?? 'N/A'}
        </div>
      </div>
    </div>
  );
}