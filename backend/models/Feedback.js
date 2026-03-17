const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    siteId:  { type: mongoose.Schema.Types.ObjectId, ref: 'HeritageSite' },
    message: { type: String, required: true },
    rating:  { type: Number, min: 1, max: 5 },
}, { timestamps: true, collection: 'feedback' });

module.exports = mongoose.model('Feedback', feedbackSchema);
