import axios from 'axios';

// ⚠️ REPLACE WITH YOUR ACTUAL BACKEND PORT
const BASE_URL = 'https://localhost:7171/api'; 

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Add Token to every request if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;