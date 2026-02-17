import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Private
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await Task.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statsObj = {
            total: 0,
            todo: 0,
            'in-progress': 0,
            done: 0
        };

        stats.forEach(stat => {
            statsObj[stat._id] = stat.count;
            statsObj.total += stat.count;
        });

        res.status(200).json({
            success: true,
            data: statsObj
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { status, priority, search } = req.query;
        const userId = req.user._id;

        // Build query
        const query = { userId };

        if (status && status !== 'all') {
            query.status = status;
        }

        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
    body('title').trim().notEmpty().withMessage('Task title is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { title, description, status, priority } = req.body;

        const task = await Task.create({
            title,
            description,
            status: status || 'todo',
            priority: priority || 'medium',
            userId: req.user._id
        });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check ownership
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task'
            });
        }

        const { title, description, status, priority } = req.body;

        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;

        const updatedTask = await task.save();

        res.status(200).json({
            success: true,
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check ownership
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this task'
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
