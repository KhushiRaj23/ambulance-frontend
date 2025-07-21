import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';
import Notification from './components/Notification';

export default function Profile() {
  const { user, loading, error, fetchProfile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: '', latitude: '', longitude: '', password: '' });
  const [success, setSuccess] = useState('');
  const hasFetchedProfile = useRef(false);

  useEffect(() => {
    if (user && user.id) {
      fetchProfile(user.id);
    }
    // eslint-disable-next-line
  }, []); // Only run on mount

  useEffect(() => {
    if (user) {
      setForm({ email: user.email || '', latitude: user.latitude || '', longitude: user.longitude || '', password: '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({ email: user.email || '', latitude: user.latitude || '', longitude: user.longitude || '', password: '' });
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use old values if fields are blank (except password)
    const updateData = {
      email: form.email || user.email,
      latitude: form.latitude || user.latitude,
      longitude: form.longitude || user.longitude,
    };
    if (form.password) updateData.password = form.password;
    const res = await updateProfile(updateData);
    if (res.success) {
      setSuccess('Profile updated successfully!');
      setEditing(false);
    }
    // error is handled by context
  };

  if (loading) return <Loader />;
  if (!user) return <div className="text-center mt-10 text-red-600">Not logged in.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">User Profile</h2>
      <Notification type="error" message={error} />
      {success && <Notification type="success" message={success} />}
      {editing ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Email:</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="rounded px-3 py-2 border" />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Latitude:</label>
            <input type="text" name="latitude" value={form.latitude} onChange={handleChange} className="rounded px-3 py-2 border" />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Longitude:</label>
            <input type="text" name="longitude" value={form.longitude} onChange={handleChange} className="rounded px-3 py-2 border" />
          </div>
          <div className="flex flex-col">
            <label className="font-medium mb-1">Password (leave blank to keep unchanged):</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="rounded px-3 py-2 border" />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleCancel} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
          </div>
        </form>
      ) : (
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
          <div className="flex justify-end">
            <button onClick={handleEdit} className="px-4 py-2 rounded bg-blue-600 text-white">Edit Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}