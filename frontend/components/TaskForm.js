import { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData, users }) => {
    // Initialize form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        assignedTo: '',
        dueDate: '' // Empty string by default
    });

    // Update form when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'Pending',
                priority: initialData.priority || 'Medium',
                assignedTo: initialData.assignedTo || '',
                // Only set dueDate if it exists and is valid
                dueDate: initialData.dueDate && initialData.dueDate !== 'Invalid date'
                    ? initialData.dueDate.split('T')[0]
                    : ''
            });
        } else {
            // Reset form when initialData is null
            setFormData({
                title: '',
                description: '',
                status: 'Pending',
                priority: 'Medium',
                assignedTo: '',
                dueDate: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // For dueDate, if the value is empty, set it to empty string
        const finalValue = name === 'dueDate' && !value ? '' : value;
        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Create a new object without dueDate if it's empty
        const submissionData = { ...formData };
        if (!submissionData.dueDate) {
            delete submissionData.dueDate;
        }
        onSubmit(submissionData);

        // Reset form after submit if not editing
        if (!initialData) {
            setFormData({
                title: '',
                description: '',
                status: 'Pending',
                priority: 'Medium',
                assignedTo: '',
                dueDate: ''
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full  mx-auto p-6 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800">
            <div className="mb-6">
                <label htmlFor="title" className="block text-zinc-400 text-sm font-medium mb-2">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-white placeholder-zinc-500"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="description" className="block text-zinc-400 text-sm font-medium mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-white placeholder-zinc-500 min-h-[100px]"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-6">
                    <label htmlFor="status" className="block text-zinc-400 text-sm font-medium mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-white"
                    >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="priority" className="block text-zinc-400 text-sm font-medium mb-2">
                        Priority
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-white"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="assignedTo" className="block text-zinc-400 text-sm font-medium mb-2">
                        Assign To
                    </label>
                    <select
                        id="assignedTo"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-white"
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.username || user.name || user.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="dueDate" className="block text-zinc-400 text-sm font-medium mb-2">
                        Due Date
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent text-white"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-900 font-medium border border-zinc-700"
            >
                {initialData ? 'Update Task' : 'Create Task'}
            </button>
        </form>
    );
};

export default TaskForm;
