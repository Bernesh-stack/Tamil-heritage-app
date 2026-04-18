const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const SavedSite = require('../models/SavedSite');

// GET /api/saved-sites  — get current user's saved sites
router.get('/', authMiddleware, async (req, res) => {
    try {
        const saved = await SavedSite.find({ userId: req.user.id }).populate('siteId');
        res.json(saved);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/saved-sites  — save a site
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { siteId } = req.body;
        if (!siteId) return res.status(400).json({ message: 'siteId is required' });
        
        // Prevent duplicate save
        const existing = await SavedSite.findOne({ userId: req.user.id, siteId });
        if (existing) return res.status(409).json({ message: 'Already saved' });

        const saved = await SavedSite.create({ userId: req.user.id, siteId });
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/saved-sites/:siteId  — unsave a site
router.delete('/:siteId', authMiddleware, async (req, res) => {
    try {
        await SavedSite.findOneAndDelete({ userId: req.user.id, siteId: req.params.siteId });
        res.json({ message: 'Removed from saved' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
