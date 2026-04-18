const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'CREATE_SITE', 'UPDATE_SITE', 'DELETE_SITE', 'LOGIN'
    targetId: { type: String }, // ID of the site or object affected
    details: { type: String }, // Human readable description
    ipAddress: { type: String },
}, { timestamps: true, collection: 'admin_logs' });

module.exports = mongoose.model('AdminLog', adminLogSchema);
