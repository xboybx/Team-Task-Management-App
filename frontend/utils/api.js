import axios from 'axios';
import Router from 'next/router';

const baseURL = process.env.NEXT_PUBLIC_API_URL?.trim();
console.log('Raw API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Trimmed API URL:', baseURL);

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

console.log('API Base URL:', baseURL); // For debugging

api.interceptors.request.use((config) => {
    console.log('Full request URL:', `${config.baseURL}${config.url}`);
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