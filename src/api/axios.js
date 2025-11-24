import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (credentials) => api.post('/login/', credentials),
  register: (userData) => api.post('/register/', userData),
};

export const eventsAPI = {
  getAll: (sort = 'newest') => api.get(`/events/?sort=${sort}`),
  create: (eventData) => api.post('/events/', eventData),
  delete: (id) => api.delete(`/events/${id}/`),
  Interested: (id) => api.post(`/events/${id}/interested/`),
  getInterestedUsers: (id) => api.get(`/events/${id}/interested_users/`),
  sendNotification: (id, data)=>api.post(`/events/${id}/send_notification/`, data),
};

export default api;