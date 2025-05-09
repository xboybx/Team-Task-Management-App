export default function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center space-y-8">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-zinc-700 rounded-full animate-pulse"></div>
                    <div className="w-20 h-20 border-4 border-t-zinc-200 rounded-full animate-spin absolute top-0"></div>
                </div>
                <div className="space-y-3 text-center">
                    <h3 className="text-xl font-semibold text-zinc-200">
                        Loading Dashboard
                    </h3>
                    <p className="text-zinc-400">
                        Preparing your tasks and notifications...
                    </p>
                </div>
            </div>
        </div>
    );
}