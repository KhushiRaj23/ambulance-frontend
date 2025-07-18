import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ambulanceApi, hospitalApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';

export default function HospitalAmbulances() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ambulances, setAmbulances] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      hospitalApi.getAll().then(res => {
        const all = res.data.content || res.data;
        setHospital(all.find(h => String(h.id) === String(id)));
      }),
      ambulanceApi.getAvailable(id).then(res => setAmbulances(res.data))
    ])
      .catch(() => setError('Failed to fetch ambulances or hospital'))
      .finally(() => setLoading(false));
  }, [id]);

  const statusColor = status => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-700 border-green-300';
      case 'ON_DUTY': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'MAINTENANCE': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <button
        onClick={() => navigate('/hospitals/nearest?lat=30.67129203873947&lng=74.3291273011156')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-all duration-150 shadow"
      >
        ← Back
      </button>
      <h2 className="text-3xl font-bold mb-2 text-center">{hospital ? hospital.name : 'Hospital'} Ambulances</h2>
      {hospital && (
        <div className="mb-6 text-center text-gray-600 text-sm">{hospital.address}</div>
      )}
      <Notification type="error" message={error} />
      {loading ? <Loader /> : (
        <div className="grid gap-4">
          {ambulances.length === 0 && <div className="text-center text-gray-500">No ambulances found for this hospital.</div>}
          {ambulances.map(a => (
            <div key={a.id} className="bg-white border rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-lg transition-all duration-200 mb-2">
              <div className="flex-1 flex flex-col gap-1">
                <div className="font-semibold text-lg">Ambulance #{a.number}</div>
                <div className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold w-fit mb-1 ${statusColor(a.status)}`}>{a.status}</div>
                {a.driverInfo && <div className="text-gray-500 text-xs">Driver: {a.driverInfo}</div>}
                {/* Add more ambulance details here if available */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 