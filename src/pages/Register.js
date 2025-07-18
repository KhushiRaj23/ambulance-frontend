import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Notification from '../components/Notification';

export default function Register() {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    latitude: '',
    longitude: ''
  });
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLocalError('');
    if (!form.username.trim() || !form.email.trim() || !form.password.trim() || !form.phone.trim() || !form.latitude || !form.longitude) {
      setLocalError('Please fill in all fields.');
      return;
    }
    const success = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude)
    });
    if (success) {
      navigate('/login');
    } else {
      setLocalError('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <Notification type="error" message={error || localError} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Latitude</label>
          <input
            type="number"
            name="latitude"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.latitude}
            onChange={handleChange}
            required
            step="any"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Longitude</label>
          <input
            type="number"
            name="longitude"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.longitude}
            onChange={handleChange}
            required
            step="any"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? <Loader /> : 'Register'}
        </button>
      </form>
    </div>
  );
} 