import axios from 'axios';
import Router from 'next/router';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            Router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default api;