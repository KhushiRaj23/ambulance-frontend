import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setToken, clearToken, userApi } from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setJwt] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ username, password });
      setToken(res.data.token);
      setJwt(res.data.token);
      const userObj = res.data.user || { username, role: res.data.role || 'user', id: res.data.id };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Login failed';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(data);
      setToken(res.data.token);
      setJwt(res.data.token);
      const userObj = res.data.user || { email: data.email, role: res.data.role || 'user', id: res.data.id };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setJwt(null);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const fetchProfile = async (userId) => {
    setLoading(true);
    setError('');
    try {
      const res = await userApi.getProfile(userId);
      // Only update if data is different
      if (JSON.stringify(res.data) !== JSON.stringify(user)) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to fetch profile';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    setLoading(true);
    setError('');
    try {
      const res = await userApi.updateProfile(updateData);
      // Only update if data is different
      if (JSON.stringify(res.data) !== JSON.stringify(user)) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      return { success: true, data: res.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to update profile';
      const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Failed to update profile';
      setError(safeErrorMessage);
      return { success: false, error: safeErrorMessage };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, fetchProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
} 