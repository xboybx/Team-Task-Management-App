export default function NotificationList({ notifications, onMarkRead }) {
    return (
        <div className="w-full max-w-md mx-auto">
            <ul className="space-y-4">
                {notifications.map(notification => (
                    <li
                        key={notification._id}
                        className={`group flex items-start justify-between p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg ${notification.read ? 'opacity-75' : ''
                            }`}
                    >
                        <span className={`text-sm ${notification.read ? 'text-zinc-400' : 'text-white'}`}>
                            {notification.message}
                        </span>

                        {!notification.read && (
                            <button
                                onClick={() => onMarkRead(notification._id)}
                                className="ml-3 p-1 text-zinc-400 hover:text-green-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            {notifications.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                    No notifications
                </div>
            )}
        </div>
    );
}
