const express = require('express');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Create a new task
router.post('/', async (req, res) => {
    try {
        // Extract user ID from token to set assignedBy and createdBy
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (req.body.assignedTo) {
            req.body.assignedBy = userId;
        }
        if (!req.body.createdBy) {
            req.body.createdBy = userId;
        }

        const task = new Task(req.body);
        await task.save();

        // Create notification for assigned user
        if (task.assignedTo) {
            const notification = new Notification({
                user: task.assignedTo,
                message: `A new task "${task.title}" has been assigned to you.`,
            });
            await notification.save();
        }

        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all tasks (with optional filters and categories)
router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.priority) filters.priority = req.query.priority;
        if (req.query.dueDate) filters.dueDate = { $lte: new Date(req.query.dueDate) };
        if (req.query.search) {
            filters.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Extract user ID from token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const category = req.query.category;

        if (category === 'all') {
            // No user filtering, return all tasks
        } else if (category === 'your-tasks') {
            filters.$or = [
                { createdBy: userId },
                { assignedTo: userId }
            ];
        } else if (category === 'assigned-tasks') {
            filters.createdBy = userId;
            filters.assignedTo = { $ne: null };
        } else if (category === 'assigned-to-you') {
            filters.assignedTo = userId;
        } else if (category === 'overdue') {
            filters.$and = [
                { dueDate: { $lt: new Date() } },
                {
                    $or: [
                        { createdBy: userId },
                        { assignedTo: userId }
                    ]
                }
            ];
        } else {
            filters.$or = [
                { createdBy: userId },
                { assignedTo: userId }
            ];
        }

        const tasks = await Task.find(filters).populate('createdBy assignedTo');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('createdBy assignedTo');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a task by ID
router.put('/:id', async (req, res) => {
    try {
        // Prevent overwriting createdBy field on update
        const updateData = { ...req.body };
        delete updateData.createdBy;

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Create notification for original assigner if updater is not the creator
        if (task.createdBy.toString() !== userId) {
            const notification = new Notification({
                user: task.createdBy,
                message: `The task "${task.title}" assigned by you has been updated.`,
            });
            await notification.save();
        }

        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Optional: Check if user has permission to delete
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Delete task error:', err);
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
});

module.exports = router;
