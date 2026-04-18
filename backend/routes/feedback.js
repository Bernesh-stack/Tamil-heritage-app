const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// POST /api/feedback
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { siteId, message, rating } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required.' });
        
        const fb = await Feedback.create({ userId: req.user.id, siteId, message, rating });
        
        // Mark feedback as given for the user
        await User.findByIdAndUpdate(req.user.id, { feedbackGiven: true });
        
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: fb });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/feedback — get all feedbacks (admin/global)
router.get('/', async (req, res) => {
    try {
        const list = await Feedback.find()
            .populate('userId', 'name')
            .populate('siteId', 'name')
            .sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/feedback/user/me — get current user's feedbacks
router.get('/user/me', authMiddleware, async (req, res) => {
    try {
        const list = await Feedback.find({ userId: req.user.id }).populate('siteId', 'name');
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/feedback/:siteId
router.get('/:siteId', async (req, res) => {
    try {
        const list = await Feedback.find({ siteId: req.params.siteId }).populate('userId', 'name');
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
