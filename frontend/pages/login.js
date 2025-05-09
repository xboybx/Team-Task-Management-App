import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/router';
import api from '../utils/api'; // Assuming you have an api instance

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const handleAuthSuccess = (userData) => {
        setUser(userData);
        router.push('/dashboard');
    };

    const handleLogin = async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <AuthForm isLogin={true} onAuthSuccess={handleAuthSuccess} />
        </div>
    );
}
