const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Move validation helpers to a separate utils file
const { validateEmail, validatePassword } = require('../utils/validation');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Combined validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json(createUserResponse(user, token));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json(createUserResponse(user, token));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get current user - requires auth
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Helper functions
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const createUserResponse = (user, token) => {
    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    };
};

module.exports = router;
