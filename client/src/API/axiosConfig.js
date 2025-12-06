import axios from 'axios';

// 1. Get the URL from your environment file (.env.production or .env)
const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
    // 2. Use the variable we defined above
    baseURL: apiUrl,
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