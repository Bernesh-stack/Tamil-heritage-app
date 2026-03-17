const mongoose = require('mongoose');

const savedSiteSchema = new mongoose.Schema({
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    siteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'HeritageSite', required: true },
}, { timestamps: true, collection: 'saved_sites' });

savedSiteSchema.index({ userId: 1, siteId: 1 }, { unique: true });

module.exports = mongoose.model('SavedSite', savedSiteSchema);
