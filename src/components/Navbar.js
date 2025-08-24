import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Menu, X, Shield, User, History, MapPin, Plus, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEmergencyCall = () => {
    // In a real app, this would trigger an emergency call
    window.open('tel:911', '_self');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenuButton = document.querySelector('[data-mobile-menu]');
      if (mobileMenuButton && !mobileMenuButton.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              PulseRide
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            {!user && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                  Register
                </Link>
              </>
            )}
            {user && (
              <>
                {(!user.role || user.role.toLowerCase() !== 'admin') && (
                  <>
                    <Link to="/history" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      <History className="w-4 h-4" />
                      <span>History</span>
                    </Link>
                    <Link to="/book-ambulance" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Book Ambulance</span>
                    </Link>
                    <Link to="/hospitals/nearest" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      <MapPin className="w-4 h-4" />
                      <span>Hospitals</span>
                    </Link>
                  </>
                )}
                {user.role && user.role.toLowerCase() === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Emergency Call Button - Centered */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleEmergencyCall}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Emergency</span>
            </button>
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>{user.name || user.email || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              data-mobile-menu
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </Link>
              
              {/* Emergency Button in Mobile Menu */}
              <button
                onClick={handleEmergencyCall}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-center justify-center"
              >
                <Phone className="w-4 h-4" />
                <span>Emergency</span>
              </button>
              
              {!user && (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                    Register
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  {(!user.role || user.role.toLowerCase() !== 'admin') && (
                    <>
                      <Link to="/history" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                        <History className="w-4 h-4" />
                        <span>History</span>
                      </Link>
                      <Link to="/book-ambulance" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Book Ambulance</span>
                      </Link>
                      <Link to="/hospitals/nearest" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                        <MapPin className="w-4 h-4" />
                        <span>Hospitals</span>
                      </Link>
                    </>
                  )}
                  {user.role && user.role.toLowerCase() === 'admin' && (
                    <Link to="/admin" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 