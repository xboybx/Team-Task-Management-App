import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import jwtDecode from 'jwt-decode/build/jwt-decode.cjs';  // Use specific import path
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import NotificationList from '../components/NotificationList';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [yourTasks, setYourTasks] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [assignedToYouTasks, setAssignedToYouTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [users, setUsers] = useState([]);
    // const [search, setSearch] = useState('');
    // const [filterStatus, setFilterStatus] = useState('');
    // const [filterPriority, setFilterPriority] = useState('');
    const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchTasks = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        Promise.all([
            api.get('/api/tasks?category=your-tasks'),
            api.get('/api/tasks?category=assigned-tasks'),
            api.get('/api/tasks?category=assigned-to-you'),
            api.get('/api/tasks?category=overdue'),
        ]).then(([yourRes, assignedRes, assignedToYouRes, overdueRes]) => {
            setYourTasks(yourRes.data);
            setAssignedTasks(assignedRes.data);
            setAssignedToYouTasks(assignedToYouRes.data);
            setOverdueTasks(overdueRes.data);
        }).catch(err => console.error(err));
    };

    const fetchNotifications = () => {
        if (!user?._id) return;
        api.get(`/api/notifications/${user._id}`)
            .then(res => setNotifications(res.data))
            .catch(err => console.error(err));
    };

    const fetchUsers = () => {
        api.get('/api/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Verify token validity
        api.get('/api/auth/me')
            .then(res => {
                setUser(res.data);
                setIsLoading(false);
                fetchTasks();
                fetchUsers();
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
            });
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    const handleTaskSubmit = (taskData) => {
        if (!user || !user._id) {
            // console.warn('User ID is missing, cannot set createdBy');
            return;
        }

        const preparedTaskData = {
            ...taskData,
            assignedTo: taskData.assignedTo || null,
            createdBy: user._id,
            title: taskData.title,
            description: taskData.description,
            status: taskData.status || 'Pending',
            priority: taskData.priority || 'Medium',
            dueDate: taskData.dueDate
        };

        if (editingTask) {
            api.put(`/api/tasks/${editingTask._id}`, preparedTaskData)
                .then(response => {
                    // console.log('Update response:', response.data);
                    setEditingTask(null);
                    fetchTasks();
                })
                .catch(err => {
                    // console.error('Error updating task:', err.response?.data || err);
                    alert('Failed to update task. Please try again.');
                });
        } else {
            api.post('/api/tasks', preparedTaskData)
                .then(response => {
                    // console.log('Create response:', response.data);
                    setEditingTask(null);
                    fetchTasks();
                })
                .catch(err => {
                    console.error('Error creating task:', err.response?.data || err);
                    alert('Failed to create task. Please try again.');
                });
        }
    };

    const handleEdit = (task) => {
        // console.log('Editing task:', task);
        setEditingTask({
            ...task,
            assignedTo: task.assignedTo?._id || task.assignedTo || '',
            dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await api.delete(`/api/tasks/${taskId}`);
            if (response.status === 200) {
                fetchTasks(); // Refresh all task categories
            }
        } catch (err) {
            console.error('Error deleting task:', err);
            // Show error to user
            alert(err.response?.data?.message || 'Failed to delete task');
        }
    };

    const handleMarkNotificationRead = (notificationId) => {
        api.put(`/api/notifications/${notificationId}/read`)
            .then(() => fetchNotifications())
            .catch(err => console.error(err));
    };

    // Add this new function after fetchTasks
    /*
    const filterTasks = (tasks) => {
        return tasks.filter(task => {
            const matchesSearch = search.toLowerCase() === '' ||
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

            const matchesStatus = filterStatus === '' || task.status === filterStatus;
            const matchesPriority = filterPriority === '' || task.priority === filterPriority;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    };
    */

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <h1 className="bg-gradient-to-r from-gray-500 to-gray-800 bg-clip-text text-transparent font-semibold text-3xl">
                        Task Management
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsNotificationDrawerOpen(true)}
                            className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <span className="text-zinc-400">
                            Welcome, {user && (user.name || user.username) ? (user.name || user.username) : 'User'}
                        </span>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                            className="px-4 py-2 text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 border border-zinc-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {isNotificationDrawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsNotificationDrawerOpen(false)}
                    />
                    <div className="fixed right-0 top-0 h-full w-96 bg-zinc-900 border-l border-zinc-800 z-50 shadow-xl transform transition-transform duration-200 ease-in-out">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Notifications</h2>
                            <button
                                onClick={() => setIsNotificationDrawerOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto h-[calc(100vh-5rem)]">
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
                                                onClick={() => handleMarkNotificationRead(notification._id)}
                                                className="ml-3 p-1 text-zinc-400 hover:text-green-400 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                        )}
                                    </li>
                                ))}
                                {notifications.length === 0 && (
                                    <div className="text-center py-8 text-zinc-500">
                                        No notifications
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            )}

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Task Form Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">
                            {editingTask ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        {editingTask && (
                            <button
                                onClick={() => setEditingTask(null)}
                                className="px-4 py-2 text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 border border-zinc-700"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    {!user || !user._id ? (
                        <p className="text-zinc-400">Loading user information...</p>
                    ) : (
                        <TaskForm onSubmit={handleTaskSubmit} initialData={editingTask} users={users} />
                    )}
                </section>

                {/* Search and Filter Section
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Search and Filter</h2>
                    <div className="flex flex-wrap gap-4">
                        <input
                            placeholder="Search tasks"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 text-white placeholder-zinc-500"
                        />
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 text-white"
                        >
                            <option value="">All Statuses</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                        <select
                            value={filterPriority}
                            onChange={e => setFilterPriority(e.target.value)}
                            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 text-white"
                        >
                            <option value="">All Priorities</option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                </section>
                */}

                {/* Task Categories Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Task Categories</h2>
                    <TaskList
                        taskCategories={{
                            'your-tasks': yourTasks,
                            'assigned-tasks': assignedTasks,
                            'assigned-to-you': assignedToYouTasks,
                            'overdue-tasks': overdueTasks
                        }}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </section>
            </main>
        </div>
    );
}


