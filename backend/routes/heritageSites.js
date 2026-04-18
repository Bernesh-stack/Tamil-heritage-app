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

// Admin Middleware (Internal use for this file)
const { authMiddleware } = require('../middleware/auth'); // Check if auth is exported like this or use direct import
// Actually auth.js exports a single function.
const User = require('../models/User');

const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) return res.status(403).json({ message: 'Access denied. Admin only.' });
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const auth = require('../middleware/auth');
const logAdminAction = require('../middleware/adminLogger');

// POST /api/heritage-sites (Admin Only)
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const { name, location, detail, builtBy, overview, history, significance, googleMapsUrl, image } = req.body;
        
        if (!name || !location || !overview) {
            return res.status(400).json({ message: 'Name, location, and overview are required.' });
        }

        if (image && !image.startsWith('http')) {
            return res.status(400).json({ message: 'Image must be a valid URL starting with http/https.' });
        }

        // SMART AUTO-IMAGE: Generate a relevant heritage image URL if not provided
        const finalData = { ...req.body };
        if (!finalData.image) {
            const searchQuery = name.replace(/\s+/g, ',');
            finalData.image = `https://loremflickr.com/1280/720/heritage,india,${searchQuery}/all`;
        }

        const site = await HeritageSite.create(finalData);
        
        // Log activity
        await logAdminAction(req.user.id, 'CREATE_SITE', site._id, `Created site: ${site.name}`, req);
        
        res.status(201).json(site);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/heritage-sites/:id (Admin Only)
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const { name, description, image } = req.body;
        
        if (name === '' || description === '') {
            return res.status(400).json({ message: 'Name and description cannot be empty.' });
        }

        if (image && !image.startsWith('http')) {
            return res.status(400).json({ message: 'Image must be a valid URL.' });
        }

        const site = await HeritageSite.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!site) return res.status(404).json({ message: 'Site not found' });
        
        // Log activity
        await logAdminAction(req.user.id, 'UPDATE_SITE', site._id, `Updated site: ${site.name}`, req);
        
        res.json(site);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE /api/heritage-sites/:id (Admin Only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const siteId = req.params.id;
        const site = await HeritageSite.findById(siteId);
        if (!site) return res.status(404).json({ message: 'Site not found' });
        
        const siteName = site.name;
        await HeritageSite.findByIdAndDelete(siteId);
        
        // Auto-remove from all users' saved lists
        const SavedSite = require('../models/SavedSite');
        await SavedSite.deleteMany({ siteId });

        // Log activity
        await logAdminAction(req.user.id, 'DELETE_SITE', siteId, `Deleted site: ${siteName}`, req);

        res.json({ message: 'Site and its bookmarks deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
