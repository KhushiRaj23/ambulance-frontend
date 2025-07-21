import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Notification from './components/Notification';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './Profile';
import HospitalSearch from './pages/HospitalSearch';
import AmbulanceBooking from './pages/AmbulanceBooking';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import ManageHospitals from './pages/ManageHospitals';
import ManageAmbulances from './pages/ManageAmbulances';
import AdminBookings from './pages/AdminBookings';
import HospitalAmbulances from './pages/HospitalAmbulances';

function Home() {
  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded shadow text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Ambulance App</h1>
      <p className="text-lg mb-2">Book ambulances, find hospitals, and manage your profile.</p>
      <p className="text-gray-600">Use the navigation bar to get started.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4 pt-20 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospitals/nearest"
            element={
              <ProtectedRoute>
                <HospitalSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospitals/:id/ambulances"
            element={
              <ProtectedRoute>
                <HospitalAmbulances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-ambulance"
            element={
              <ProtectedRoute>
                <AmbulanceBooking />
              </ProtectedRoute>
            }
          />
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hospitals"
            element={
              <ProtectedRoute adminOnly>
                <ManageHospitals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ambulances"
            element={
              <ProtectedRoute adminOnly>
                <ManageAmbulances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}