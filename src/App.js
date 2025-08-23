import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import Home from './pages/Home';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Profile />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <BookingHistory />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospitals/nearest"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <HospitalSearch />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospitals/:id/ambulances"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <HospitalAmbulances />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-ambulance"
              element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AmbulanceBooking />
                  </div>
                </ProtectedRoute>
              }
            />
            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminDashboard />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hospitals"
              element={
                <ProtectedRoute adminOnly>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ManageHospitals />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ambulances"
              element={
                <ProtectedRoute adminOnly>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ManageAmbulances />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdminBookings />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}