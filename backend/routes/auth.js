const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
    jwt.sign(
        { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Name, email and password are required.' });

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(409).json({ message: 'This email is already registered. Please login.' });

        const user = await User.create({ name, email, password, phone });
        res.status(201).json({ message: 'Account created successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required.' });

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });

        const token = signToken(user);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
