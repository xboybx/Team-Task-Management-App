import { useState } from 'react';

export default function TaskList({ taskCategories, onEdit, onDelete }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaskDescription, setSelectedTaskDescription] = useState(null);
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCategory(null);
        setIsModalOpen(false);
    };

    const handleEditClick = (e, task) => {
        e.stopPropagation(); // Prevent modal from closing
        onEdit(task);
        handleCloseModal();
    };

    const handleDeleteClick = (e, taskId) => {
        e.stopPropagation(); // Prevent modal from closing
        onDelete(taskId);
        handleCloseModal();
    };

    const handleDescriptionClick = (e, task) => {
        e.stopPropagation();
        setSelectedTaskDescription({
            title: task.title,
            description: task.description
        });
    };

    const handleCloseDescription = () => {
        setSelectedTaskDescription(null);
    };

    const toggleDescription = (e, taskId) => {
        e.stopPropagation();
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(taskCategories).map(([category, tasks]) => (
                    <div
                        key={category}
                        onClick={() => handleCategoryClick({ name: category, tasks })}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-lg hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer"
                    >
                        <div className="space-y-3">
                            <h3 className="text-xl font-bold text-white">
                                {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            <div className="flex items-center space-x-3">
                                <span className="text-zinc-400 text-sm">
                                    {tasks.length} tasks
                                </span>
                                <span className="h-1 w-1 bg-zinc-700 rounded-full"></span>
                                <span className="text-zinc-400 text-sm">
                                    {tasks.filter(t => t.status === 'Completed').length} completed
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tasks Modal */}
            {isModalOpen && selectedCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">
                                {selectedCategory.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                            <div className="space-y-4">
                                {selectedCategory.tasks.map(task => (
                                    <div
                                        key={task._id}
                                        className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium text-white">
                                                    {task.title}
                                                </h3>
                                                <div className="flex items-center space-x-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-md ${task.status === 'Completed' ? 'bg-green-900/30 text-green-400' :
                                                        task.status === 'In Progress' ? 'bg-yellow-900/30 text-yellow-400' :
                                                            'bg-zinc-800 text-zinc-400'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                    <span className="text-zinc-400">
                                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                    <button
                                                        onClick={(e) => handleDescriptionClick(e, task)}
                                                        className="px-2 py-1 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                                                    >
                                                        View Description
                                                    </button>
                                                    <span className={`px-2 py-1 rounded-md ${task.priority === 'High' ? 'bg-red-900/30 text-red-400' :
                                                        task.priority === 'Medium' ? 'bg-orange-900/30 text-orange-400' :
                                                            'bg-blue-900/30 text-blue-400'
                                                        }`}>
                                                        {task.priority || 'Low'} Priority
                                                    </span>
                                                </div>
                                                {expandedTaskId === task._id && (
                                                    <div className="mt-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700">
                                                        <p className="text-sm text-zinc-300">
                                                            {task.description || 'No description available'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={(e) => handleEditClick(e, task)}
                                                    className="px-3 py-1.5 text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 border border-zinc-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, task._id)}
                                                    className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-900 border border-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {selectedCategory.tasks.length === 0 && (
                                    <div className="text-center py-12 text-zinc-500">
                                        No tasks found in this category
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Description Modal */}
            {selectedTaskDescription && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white break-words pr-4">
                                {selectedTaskDescription.title}
                            </h3>
                            <button
                                onClick={handleCloseDescription}
                                className="text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 max-h-[600px] overflow-y-auto scrollbar-hide">
                            <div className="overflow-x-auto scrollbar-hide">
                                <pre className="text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed inline-block min-w-fit">
                                    {selectedTaskDescription.description || 'No description available'}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
