import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/AuthForm';

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState(null);

    const handleAuthSuccess = async (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            await router.push('/dashboard');
        } catch (err) {
            console.error('Navigation error:', err);
            setError('Failed to redirect after registration');
        }
    };

    return (
        <div>
            {error && <div className="text-red-500">{error}</div>}
            <AuthForm isLogin={false} onAuthSuccess={handleAuthSuccess} />
        </div>
    );
}
