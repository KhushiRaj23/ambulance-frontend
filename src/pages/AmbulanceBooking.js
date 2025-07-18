import React, { useState, useEffect } from 'react';
import { hospitalApi, ambulanceApi, bookingApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';

export default function AmbulanceBooking() {
  const { user } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);

  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [bookingType, setBookingType] = useState('NORMAL');
  const [patient, setPatient] = useState({ name: '', age: '', gender: '', condition: '' });

  const navigate = useNavigate();

  useEffect(() => {
    hospitalApi.getAll().then(res => {
      setHospitals(res.data.content || res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      ambulanceApi.getAvailable(selectedHospital).then(res => {
        setAmbulances(res.data);
      });
    } else {
      setAmbulances([]);
    }
    setSelectedAmbulance('');
  }, [selectedHospital]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const { name, age, gender, condition } = patient;

    if (!selectedHospital || !selectedAmbulance || !name.trim() || !age || !gender || !condition.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      await bookingApi.book(user.id, {
        hospitalId: Number(selectedHospital),
        ambulanceId: Number(selectedAmbulance),
        bookingType,
        patient: {
          name: name.trim(),
          age: Number(age),
          gender,
          condition: condition.trim()
        }
      });

      setSuccess('Ambulance booked successfully!');
      setPatient({ name: '', age: '', gender: '', condition: '' });
      setBookingType('NORMAL');
      setSelectedHospital('');
      setSelectedAmbulance('');

      setTimeout(() => navigate('/history'), 1500);
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-14 p-8 bg-white shadow-lg border border-gray-200 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Book an Ambulance</h2>

      <Notification type="error" message={error} />
      <Notification type="success" message={success} />

      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        {/* Hospital */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Select Hospital</label>
          <select
            value={selectedHospital}
            onChange={e => setSelectedHospital(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Choose hospital --</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        {/* Ambulance */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Available Ambulances</label>
          <select
            value={selectedAmbulance}
            onChange={e => setSelectedAmbulance(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedHospital}
            required
          >
            <option value="">{selectedHospital ? 'Select ambulance' : 'Select hospital first'}</option>
            {ambulances.map(a => (
              <option key={a.id} value={a.id}>{a.number} {a.driverInfo ? `- ${a.driverInfo}` : ''}</option>
            ))}
          </select>
        </div>

        {/* Booking Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Booking Type</label>
          <select
            value={bookingType}
            onChange={e => setBookingType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NORMAL">Normal</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>

        {/* Patient Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            value={patient.name}
            onChange={e => setPatient(p => ({ ...p, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Patient Age */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Patient Age</label>
          <input
            type="number"
            value={patient.age}
            onChange={e => setPatient(p => ({ ...p, age: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
        </div>

        {/* Patient Gender */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Patient Gender</label>
          <select
            value={patient.gender}
            onChange={e => setPatient(p => ({ ...p, gender: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Patient Condition */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Condition</label>
          <input
            type="text"
            value={patient.condition}
            onChange={e => setPatient(p => ({ ...p, condition: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Loader /> : 'Book Ambulance'}
          </button>
        </div>
      </form>
    </div>
  );
}
