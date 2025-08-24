import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_PULSERIDE_APP_API_URL || 'http://localhost:8080'}/api`,
});

let jwtToken = null;

export function setToken(token) {
  jwtToken = token;
}
export function clearToken() {
  jwtToken = null;
}

api.interceptors.request.use((config) => {
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }
  return config;
});

// --- Auth ---
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// --- User ---
export const userApi = {
  getProfile: (userId) => api.get(`/user/profile`, { params: { userId } }),
  getBookingHistory: (userId) => api.get(`/user/booking/history`, { params: { userId } }),
  updateProfile: (data) => api.put('/user/profile', data),
};

// --- Hospital ---
export const hospitalApi = {
  getNearest: (lat, lng) => api.get('/hospitals/nearest', { params: { lat, lng } }),
  getAll: (page = 0, size = 10) => api.get('/hospitals/all', { params: { page, size } }),
  add: (hospital) => api.post('/admin/hospitals/add', hospital),
  remove: (hospitalId) => api.delete('/admin/hospitals/remove', { params: { hospitalId } }),
};

// --- Ambulance ---
export const ambulanceApi = {
  getAvailable: (hospitalId) => api.get('/ambulances/available', { params: { hospitalId } }),
  getAllAvailable: () => api.get('/ambulances/available/all'),
  getAll: () => api.get('/admin/ambulances/all'),
  add: (ambulance) => api.post('/admin/ambulances/add', ambulance),
  remove: (ambulanceId) => api.delete('/admin/ambulances/remove', { params: { ambulanceId } }),
  changeStatus: (ambulanceId, status) => api.patch('/admin/ambulance/status', null, { params: { ambulanceId, status } }),
};

// --- Booking ---
export const bookingApi = {
  book: (userId, bookingRequest) => api.post('/booking/book', bookingRequest, { params: { userId } }),
  getHistory: (userId) => api.get('/booking/history', { params: { userId } }),
};

// --- Admin ---
export const adminApi = {
  getAllBookings: () => api.get('/admin/bookings/all'),
  getAllBookingsPaged: (page = 0, size = 10) => api.get('/admin/bookings/all/paged', { params: { page, size } }),
  changeBookingStatus: (bookingId, status) => api.patch('/admin/bookings/status', null, { params: { bookingId, status } }),
};

export default api; 