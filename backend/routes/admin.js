const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const HeritageSite = require('../models/HeritageSite');
const Feedback = require('../models/Feedback');

const AdminLog = require('../models/AdminLog');

// GET /api/admin/stats
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser || !currentUser.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const [userCount, siteCount, feedbackCount] = await Promise.all([
            User.countDocuments() || 0,
            HeritageSite.countDocuments() || 0,
            Feedback.countDocuments() || 0
        ]);

        res.json({
            totalUsers: userCount,
            totalHeritageSites: siteCount,
            totalFeedback: feedbackCount,
            status: 'Active'
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/logs
router.get('/logs', authMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser || !currentUser.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const logs = await AdminLog.find()
            .populate('adminId', 'name')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
