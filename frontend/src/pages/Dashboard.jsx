import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI } from '@/services/api';
import { Layers, LogOut, Search, Plus, Edit2, Trash2, Mail, User } from 'lucide-react';
import TaskModal from '@/components/TaskModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, todo: 0, 'in-progress': 0, done: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
        fetchStats();
    }, [statusFilter, priorityFilter, searchQuery]);

    const fetchTasks = async () => {
        try {
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            if (priorityFilter !== 'all') params.priority = priorityFilter;
            if (searchQuery) params.search = searchQuery;

            const response = await tasksAPI.getAll(params);
            setTasks(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await tasksAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await tasksAPI.delete(taskId);
                fetchTasks();
                fetchStats();
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task');
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        fetchTasks();
        fetchStats();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'todo':
                return 'bg-blue-100 text-blue-700';
            case 'in-progress':
                return 'bg-purple-100 text-purple-700';
            case 'done':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            case 'low':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                        <Layers className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-xl font-bold text-gray-900">TaskFlow</span>
                </div>

                {/* Profile section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                        <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{user?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="break-all">{user?.email}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">@{user?.username}</div>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                        <div className="text-xs text-blue-600 font-medium">Total</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-700">{stats.todo}</div>
                        <div className="text-xs text-gray-600 font-medium">To Do</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-700">{stats['in-progress']}</div>
                        <div className="text-xs text-purple-600 font-medium">In Progress</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-700">{stats.done}</div>
                        <div className="text-xs text-green-600 font-medium">Done</div>
                    </div>
                </div>

                {/* Sign out button */}
                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 max-w-md relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        {/* Filters */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        {/* New Task button */}
                        <button
                            onClick={handleCreateTask}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            New Task
                        </button>
                    </div>
                </div>

                {/* Tasks content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {loading ? (
                        <div className="text-center text-gray-600">Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">No tasks yet. Create your first one!</p>
                            <button
                                onClick={handleCreateTask}
                                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                CreateTask
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow p-5"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900 flex-1 pr-2">{task.title}</h3>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEditTask(task)}
                                                className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {task.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                                            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        </span>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Task Modal */}
            {isModalOpen && (
                <TaskModal
                    task={editingTask}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default Dashboard;
