const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const HeritageSite = require('../models/HeritageSite');
const Feedback = require('../models/Feedback');

// GET /api/admin/stats
// Only admins should access this, but for simplicity we'll check isAdmin in route if needed
// or just rely on the frontend calling it for admin users
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        // Double check admin status
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

module.exports = router;
