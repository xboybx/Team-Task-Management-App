import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/router';

export default function Register() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const handleAuthSuccess = (userData) => {
        setUser(userData);
        router.push('/dashboard');
    };

    return (
        <div>
            <AuthForm isLogin={false} onAuthSuccess={handleAuthSuccess} />
        </div>
    );
}
