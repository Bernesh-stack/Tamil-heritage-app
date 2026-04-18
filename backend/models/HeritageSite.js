const mongoose = require('mongoose');

const heritageSiteSchema = new mongoose.Schema({
    name:             { type: String, required: true },
    location:         { type: String, required: true },   // display label e.g. "MADURAI, TAMIL NADU"
    detail:           { type: String, required: true },   // city name for filtering e.g. "Madurai"
    description:      { type: String, required: true },   // short description for list
    fullDescription:  { type: String },                    // detailed description
    imageKey:         { type: String },                    // key for local images
    image:            { type: String },                    // URL for public images
    category:         { type: String },                    // Temple / Monument / Cultural Site
    builtBy:          { type: String },
    year:             { type: String },
}, { timestamps: true, collection: 'heritage_sites' });

module.exports = mongoose.model('HeritageSite', heritageSiteSchema);
