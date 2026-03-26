import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('sqms_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('sqms_token');
            localStorage.removeItem('sqms_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Branch API
export const branchAPI = {
    getAll: (params) => api.get('/branches', { params }),
    getCities: () => api.get('/branches/cities'),
    getById: (id) => api.get(`/branches/${id}`),
    create: (data) => api.post('/branches', data),
    update: (id, data) => api.put(`/branches/${id}`, data),
    delete: (id) => api.delete(`/branches/${id}`),
};

// Queue API
export const queueAPI = {
    bookToken: (data) => api.post('/queue/book', data),
    getMyTokens: () => api.get('/queue/my-tokens'),
    cancelToken: (id) => api.put(`/queue/cancel/${id}`),
    getLiveQueue: (branchId) => api.get(`/queue/live/${branchId}`),
    getTokenByQR: (code) => api.get(`/queue/qr/${code}`),
    getPurposes: (branchId) => api.get(`/queue/purposes/${branchId}`),
    callNext: (data) => api.post('/queue/call-next', data),
    completeToken: (id) => api.put(`/queue/complete/${id}`),
    skipToken: (id) => api.put(`/queue/skip/${id}`),
};

// Analytics API
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getHourly: () => api.get('/analytics/hourly'),
    getWeekly: () => api.get('/analytics/weekly'),
    getBranchStats: () => api.get('/analytics/branches'),
    getPeakHours: () => api.get('/analytics/peak-hours'),
};

export default api;
