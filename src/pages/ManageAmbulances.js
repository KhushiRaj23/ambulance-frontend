import React, { useEffect, useState } from 'react';
import { ambulanceApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { hospitalApi } from '../api';

// ...imports remain same
export default function ManageAmbulances() {
  const navigate = useNavigate();
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [newAmbulance, setNewAmbulance] = useState({
    number: '',
    status: 'AVAILABLE',
    hospitalId: '',
    driverInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toRemove, setToRemove] = useState(null);

  const fetchAmbulances = () => {
    setLoading(true);
    setError('');
    ambulanceApi
      .getAll()
      .then(res => setAmbulances(res.data))
      .catch(() => setError('Failed to fetch ambulances'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAmbulances();
    // Fetch hospitals for dropdown
    hospitalApi.getAll().then(res => {
      setHospitals(res.data.content || res.data);
    });
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const addAmbulance = async e => {
    e.preventDefault();
    if (!newAmbulance.number.trim() || !newAmbulance.status || !newAmbulance.hospitalId) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await ambulanceApi.add({
        number: newAmbulance.number,
        status: newAmbulance.status,
        hospital: { id: Number(newAmbulance.hospitalId) },
        driverInfo: newAmbulance.driverInfo
      });
      setSuccess('Ambulance added!');
      setNewAmbulance({ number: '', status: 'AVAILABLE', hospitalId: '', driverInfo: '' });
      fetchAmbulances();
    } catch {
      setError('Failed to add ambulance');
    } finally {
      setLoading(false);
    }
  };

  const confirmRemove = id => {
    setToRemove(id);
    setShowConfirm(true);
  };

  const removeAmbulance = async () => {
    setRemovingId(toRemove);
    setShowConfirm(false);
    setError('');
    setSuccess('');
    try {
      await ambulanceApi.remove(toRemove);
      setSuccess('Ambulance removed!');
      fetchAmbulances();
    } catch {
      setError('Failed to remove ambulance');
    } finally {
      setRemovingId(null);
      setToRemove(null);
    }
  };

  const toggleStatus = async (id, status) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await ambulanceApi.changeStatus(id, status === 'AVAILABLE' ? 'ON_DUTY' : 'AVAILABLE');
      setSuccess('Ambulance status changed!');
      fetchAmbulances();
    } catch {
      setError('Failed to change status');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = status => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800 border-green-300';
      case 'ON_DUTY': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'MAINTENANCE': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const grouped = ambulances.reduce((acc, a) => {
    const hospitalName = a.hospitalName || (a.hospital && a.hospital.name) || 'Unknown Hospital';
    const hospitalKey = hospitalName + (a.hospital?.address ? ' - ' + a.hospital.address : '');
    if (!acc[hospitalKey]) acc[hospitalKey] = [];
    acc[hospitalKey].push(a);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-center flex-1 text-blue-900">Manage Ambulances</h2>
      </div>

      <Notification type="error" message={error} />
      <Notification type="success" message={success} />

      <form onSubmit={addAmbulance} className="flex flex-col md:flex-row gap-3 items-stretch mb-10 bg-blue-50 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          className="flex-1 border border-blue-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Enter ambulance number"
          value={newAmbulance.number}
          onChange={e => setNewAmbulance(a => ({ ...a, number: e.target.value }))}
          required
        />
        <select
          className="flex-1 border border-blue-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={newAmbulance.status}
          onChange={e => setNewAmbulance(a => ({ ...a, status: e.target.value }))}
          required
        >
          <option value="AVAILABLE">Available</option>
          <option value="ON_DUTY">On Duty</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
        <select
          className="flex-1 border border-blue-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={newAmbulance.hospitalId}
          onChange={e => setNewAmbulance(a => ({ ...a, hospitalId: e.target.value }))}
          required
        >
          <option value="">Select hospital</option>
          {hospitals.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
        <input
          type="text"
          className="flex-1 border border-blue-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Driver info (optional)"
          value={newAmbulance.driverInfo}
          onChange={e => setNewAmbulance(a => ({ ...a, driverInfo: e.target.value }))}
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Add</button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([hospitalKey, ambs]) => (
            <div key={hospitalKey} className="border border-blue-100 rounded-2xl shadow-lg p-6 bg-gradient-to-br from-white to-blue-50">
              <div className="flex justify-between items-start mb-5 flex-wrap gap-2">
                <h3 className="text-xl font-semibold text-blue-800">{hospitalKey.split(' - ')[0]}</h3>
                {hospitalKey.split(' - ')[1] && <div className="text-sm text-gray-600">{hospitalKey.split(' - ')[1]}</div>}
              </div>

              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {ambs.map(a => (
                  <div key={a.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition-all">
                    <div className="mb-3">
                      <div className="text-blue-700 font-bold text-base mb-1">#{a.number}</div>
                      <h4 className="font-semibold text-lg text-gray-800">{a.name}</h4>
                      <span className={`mt-1 inline-block text-xs font-medium px-3 py-1 rounded-full border ${statusColor(a.status)}`}>
                        {a.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      {a.type && <div>Type: {a.type}</div>}
                      {a.driver && <div>Driver: {a.driver}</div>}
                      {a.contactInfo && <div>Contact: {a.contactInfo}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(a.id, a.status)}
                        className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition text-sm"
                        disabled={removingId === a.id}
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => confirmRemove(a.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm"
                        disabled={removingId === a.id}
                      >
                        {removingId === a.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h4 className="text-lg font-bold mb-3">Confirm Removal</h4>
            <p className="text-sm text-gray-700 mb-5">Are you sure you want to remove this ambulance?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">Cancel</button>
              <button onClick={removeAmbulance} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}