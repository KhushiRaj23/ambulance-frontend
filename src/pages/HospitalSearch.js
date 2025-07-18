import React, { useEffect, useState } from 'react';
import { hospitalApi } from '../api';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

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
        setError('Location not available. Please update your profile.');
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError('');
    hospitalApi
      .getNearest(lat, lng)
      .then(res => setHospitals(res.data))
      .catch(() => setError('Failed to fetch hospitals'))
      .finally(() => setLoading(false));
  }, [lat, lng, user, navigate]);

  if (loading) return <Loader />;
  if (error) return <Notification type="error" message={error} />;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Nearest Hospitals</h2>
      <ul>
        {hospitals.map(h => (
          <li key={h.id} className="mb-4 p-4 border rounded flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <span className="font-semibold">{h.name}</span>
              <span className="text-gray-500 ml-2">{h.distance ? `${h.distance} km` : ''}</span>
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => navigate(`/hospitals/${h.id}/ambulances`)}
            >
              View Ambulances
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}