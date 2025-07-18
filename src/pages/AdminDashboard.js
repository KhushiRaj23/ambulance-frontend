import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
      <div className="space-y-4">
        <Link to="/admin/hospitals" className="block px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-center">Manage Hospitals</Link>
        <Link to="/admin/ambulances" className="block px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-center">Manage Ambulances</Link>
        <Link to="/admin/bookings" className="block px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-center">View All Bookings</Link>
      </div>
    </div>
  );
}