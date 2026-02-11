import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            config.headers['auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) =>
        apiClient.post('/user/login', { email, password }),

    register: (username, email, password, phoneNumber) =>
        apiClient.post('/user/register', { username, email, password, phoneNumber }),

    verify: (userId, emailCode, phoneCode) =>
        apiClient.post('/user/verify', { userId, emailCode, phoneCode })
};

// Admin API
export const adminAPI = {
    getStats: () =>
        apiClient.get('/admin/stats'),

    getAllUsers: () =>
        apiClient.get('/admin/users'),

    createUser: (userData) =>
        apiClient.post('/admin/users', userData),

    updateUserRole: (userId, role) =>
        apiClient.patch(`/admin/users/${userId}/role`, { role }),

    deleteUser: (userId) =>
        apiClient.delete(`/admin/users/${userId}`),

    // Conference API
    getAllConferences: () =>
        apiClient.get('/admin/conferences'),

    createConference: (data) =>
        apiClient.post('/admin/conferences', data),

    updateConference: (id, data) =>
        apiClient.put(`/admin/conferences/${id}`, data),

    deleteConference: (id) =>
        apiClient.delete(`/admin/conferences/${id}`)
};

export const participantAPI = {
    getDashboardData: () =>
        apiClient.get('/participant/dashboard'),

    getConferences: () =>
        apiClient.get('/participant/conferences'),

    register: (conferenceId) =>
        apiClient.post('/participant/register', { conferenceId }),

    submitPaper: (data) =>
        apiClient.post('/participant/submit', data)
};

export default apiClient;
