import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const handleAuthSuccess = (userData) => {
        setUser(userData);
        router.push('/dashboard');
    };

    return (
        <div>
            <AuthForm isLogin={true} onAuthSuccess={handleAuthSuccess} />
        </div>
    );
}
