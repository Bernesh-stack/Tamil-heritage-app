const mongoose = require('mongoose');

const heritageSiteSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    location:    { type: String, required: true },   // display label e.g. "THANJAVUR"
    detail:      { type: String, required: true },   // city name for filtering e.g. "Thanjavur"
    description: { type: String, required: true },
    imageKey:    { type: String, required: true },   // key used by app to pick local image
}, { timestamps: true, collection: 'heritage_sites' });

module.exports = mongoose.model('HeritageSite', heritageSiteSchema);
