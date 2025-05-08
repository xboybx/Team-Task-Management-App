import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

export default function AuthForm({ isLogin, onAuthSuccess }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = `/api/auth/${isLogin ? 'login' : 'register'}`;
            const payload = isLogin ? { email, password } : { email, username, password };

            console.log('Submitting to:', endpoint); // For debugging
            const response = await api.post(endpoint, payload);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onAuthSuccess?.(response.data.user);
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Auth Error:', err.response || err); // For debugging
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800">
                <h2 className="text-3xl font-bold text-center text-white mb-8">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {!isLogin && (
                    <div className="mb-6">
                        <label className="block text-zinc-400 text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-zinc-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-zinc-400 text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-zinc-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-zinc-400 text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-zinc-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {error && (
                    <div className="mb-6 p-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-800">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-900 font-medium border border-zinc-700"
                >
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>

                <p className="mt-6 text-center text-zinc-500 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        type="button"
                        onClick={() => router.push(isLogin ? '/register' : '/login')}
                        className="ml-2 text-zinc-300 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </form>
        </div>
    );
}