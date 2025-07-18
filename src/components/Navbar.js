import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow fixed top-0 left-0 w-full z-50">
      <div className="font-bold text-lg">
        <Link to="/" className="hover:text-blue-200">Ambulance App</Link>
      </div>
      <div className="space-x-4 flex items-center">
        {!user && (
          <>
            <Link to="/login" className="hover:text-blue-200">Login</Link>
            <Link to="/register" className="hover:text-blue-200">Register</Link>
          </>
        )}
        {user && (
          <>
            <Link to="/profile" className="hover:text-blue-200">Profile</Link>
            {(!user.role || user.role.toLowerCase() !== 'admin') && (
              <>
                <Link to="/history" className="hover:text-blue-200">History</Link>
                <Link to="/book-ambulance" className="hover:text-blue-200">Book Ambulance</Link>
                <Link to="/hospitals/nearest" className="hover:text-blue-200">Hospitals</Link>
              </>
            )}
            {user.role && user.role.toLowerCase() === 'admin' && (
              <Link to="/admin" className="hover:text-blue-200">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-white text-blue-700 rounded hover:bg-blue-100 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
} 