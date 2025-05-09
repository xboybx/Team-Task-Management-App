import { PulseLoader } from "react-spinners";

export default function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center space-y-8">
                <PulseLoader
                    color="#ffffff"
                    size={20}
                    speedMultiplier={0.8}
                    className="opacity-80"
                />
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold text-zinc-200 animate-pulse">
                        Loading Dashboard
                    </h3>
                    <p className="text-zinc-400">
                        Preparing your workspace...
                    </p>
                </div>
            </div>
        </div>
    );
}