import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/login/', credentials),
  register: (userData) => api.post('/register/', userData),
};

// Events APIs
export const eventsAPI = {
  getAll: () => api.get('/events/'),
  create: (eventData) => api.post('/events/', eventData),
  delete: (id) => api.delete(`/events/${id}/`),
//   toggleInterest: (id) => api.post(`/events/${id}/toggle_interest/`),
  toggleInterest: (id) => api.post(`/events/${id}/interested/`),
  getInterestedUsers: (id) => api.get(`/events/${id}/interested_users/`),
};

export default api;