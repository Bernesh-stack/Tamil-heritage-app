const router = require('express').Router();
const HeritageSite = require('../models/HeritageSite');

// GET /api/heritage-sites
router.get('/', async (req, res) => {
    try {
        const sites = await HeritageSite.find();
        res.json(sites);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET /api/heritage-sites/:id
router.get('/:id', async (req, res) => {
    try {
        const site = await HeritageSite.findById(req.params.id);
        if (!site) return res.status(404).json({ message: 'Site not found' });
        res.json(site);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
