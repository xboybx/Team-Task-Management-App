import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center min-h-screen py-12 space-y-12">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                            <span className="text-white">Task Management </span>
                            <span className="bg-gradient-to-r from-gray-500 to-gray-800 bg-clip-text text-transparent">
                                System
                            </span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-zinc-400">
                            Streamline your workflow, collaborate effortlessly, and achieve more with our modern task management solution.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => router.push('/register')}
                                className="px-8 py-3 text-base font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors duration-200 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-black"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => router.push('/login')}
                                className="px-8 py-3 text-base font-medium text-zinc-300 hover:text-white bg-transparent hover:bg-zinc-800 rounded-lg transition-colors duration-200 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-black"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {features.map((feature, index) => (
                            <div key={index} className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                                <div className="w-12 h-12 mb-4 rounded-lg bg-zinc-800 flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-zinc-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {stats.map((stat, index) => (
                            <div key={index} className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
                                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-zinc-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const features = [
    {
        icon: <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
        title: 'Task Organization',
        description: 'Organize tasks with priorities, due dates, and categories for better workflow management.'
    },
    {
        icon: <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        title: 'Team Collaboration',
        description: 'Collaborate with team members in real-time with task assignments and updates.'
    },
    {
        icon: <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
        title: 'Progress Tracking',
        description: 'Track task progress with visual indicators and detailed status updates.'
    }
];

const stats = [
    {
        value: '10K+',
        label: 'Active Users'
    },
    {
        value: '50K+',
        label: 'Tasks Completed'
    },
    {
        value: '99%',
        label: 'Satisfaction Rate'
    }
];
