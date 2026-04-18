const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// PUT /api/users/view-site/:siteId
router.put('/view-site/:siteId', authMiddleware, async (req, res) => {
    try {
        const { siteId } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let triggerFeedback = false;

        // Duplicate View Protection
        if (!user.viewedSites.includes(siteId)) {
            user.viewedSites.push(siteId);
            user.viewCount++;
        }

        // Smart Feedback Trigger Logic
        // Trigger ONLY when popup is SHOWN
        if (user.viewCount >= user.nextTriggerAt && !user.feedbackGiven) {
            triggerFeedback = true;
            user.nextTriggerAt += 5;
        }

        await user.save();

        res.json({ 
            triggerFeedback,
            viewCount: user.viewCount,
            nextTriggerAt: user.nextTriggerAt
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
