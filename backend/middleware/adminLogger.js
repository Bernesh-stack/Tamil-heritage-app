const AdminLog = require('../models/AdminLog');

const logAdminAction = async (adminId, action, targetId, details, req) => {
    try {
        await AdminLog.create({
            adminId,
            action,
            targetId,
            details,
            ipAddress: req?.ip || req?.headers['x-forwarded-for'] || 'unknown'
        });
    } catch (err) {
        console.error('Logging failed:', err);
    }
};

module.exports = logAdminAction;
