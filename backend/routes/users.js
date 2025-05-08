const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all users (id and username only)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '_id username');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
