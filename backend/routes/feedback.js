const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const Feedback = require('../models/Feedback');

// POST /api/feedback
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { siteId, message, rating } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required.' });
        const fb = await Feedback.create({ userId: req.user.id, siteId, message, rating });
        res.status(201).json(fb);
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
