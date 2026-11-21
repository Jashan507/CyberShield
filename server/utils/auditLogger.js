const AuditLog = require('../models/AuditLog');

const createAuditLog = async ({ userId, userEmail, action, description, resourceId, resourceType, ipAddress }) => {
  try {
    await AuditLog.create({
      userId,
      userEmail,
      action,
      description,
      resourceId: resourceId || undefined,
      resourceType: resourceType || undefined,
      ipAddress: ipAddress || 'unknown',
    });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

module.exports = createAuditLog;
