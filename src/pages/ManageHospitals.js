import React, { useEffect, useState } from 'react';
import { hospitalApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';

export default function ManageHospitals() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    contactInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toRemove, setToRemove] = useState(null);

  const fetchHospitals = () => {
    setLoading(true);
    setError('');
    hospitalApi
      .getAll()
      .then(res => setHospitals(res.data.content || res.data))
      .catch(() => setError('Failed to fetch hospitals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const addHospital = async e => {
    e.preventDefault();
    if (!newHospital.name.trim() || !newHospital.address.trim() || newHospital.latitude === '' || newHospital.longitude === '') {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await hospitalApi.add({
        name: newHospital.name,
        address: newHospital.address,
        latitude: parseFloat(newHospital.latitude),
        longitude: parseFloat(newHospital.longitude),
        contactInfo: newHospital.contactInfo
      });
      setSuccess('Hospital added!');
      setNewHospital({ name: '', address: '', latitude: '', longitude: '', contactInfo: '' });
      fetchHospitals();
    } catch {
      setError('Failed to add hospital');
    } finally {
      setLoading(false);
    }
  };

  const confirmRemove = id => {
    setToRemove(id);
    setShowConfirm(true);
  };

  const removeHospital = async () => {
    setRemovingId(toRemove);
    setShowConfirm(false);
    setError('');
    setSuccess('');
    try {
      await hospitalApi.remove(toRemove);
      setSuccess('Hospital removed!');
      fetchHospitals();
    } catch {
      setError('Failed to remove hospital');
    } finally {
      setRemovingId(null);
      setToRemove(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <button
        onClick={() => navigate('/admin')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-150 shadow"
      >
        ← Back
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Hospitals</h2>
      <Notification type="error" message={error} />
      <Notification type="success" message={success} />
      <form onSubmit={addHospital} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Name*"
          value={newHospital.name}
          onChange={e => setNewHospital(h => ({ ...h, name: e.target.value }))}
        />
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Address*"
          value={newHospital.address}
          onChange={e => setNewHospital(h => ({ ...h, address: e.target.value }))}
        />
        <input
          type="number"
          step="any"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Latitude*"
          value={newHospital.latitude}
          onChange={e => setNewHospital(h => ({ ...h, latitude: e.target.value }))}
        />
        <input
          type="number"
          step="any"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Longitude*"
          value={newHospital.longitude}
          onChange={e => setNewHospital(h => ({ ...h, longitude: e.target.value }))}
        />
        <input
          type="text"
          className="md:col-span-2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Contact Info"
          value={newHospital.contactInfo}
          onChange={e => setNewHospital(h => ({ ...h, contactInfo: e.target.value }))}
        />
        <button type="submit" className="md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-150 shadow">Add</button>
      </form>
      {loading ? <Loader /> : (
        <div className="grid gap-4">
          {hospitals.map(h => (
            <div key={h.id} className="bg-white border rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-lg transition-all duration-200">
              <div className="flex-1">
                <div className="font-semibold text-lg mb-1">{h.name}</div>
                <div className="text-gray-600 text-sm mb-1">{h.address}</div>
                <div className="text-gray-500 text-xs mb-1">Lat: {h.latitude} | Lng: {h.longitude}</div>
                {h.contactInfo && <div className="text-gray-500 text-xs">Contact: {h.contactInfo}</div>}
              </div>
              <button
                onClick={() => confirmRemove(h.id)}
                className="mt-3 md:mt-0 md:ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-150 shadow"
                disabled={removingId === h.id}
              >
                {removingId === h.id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <div className="font-bold mb-2">Confirm Removal</div>
            <div className="mb-4">Are you sure you want to remove this hospital?</div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={removeHospital} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}