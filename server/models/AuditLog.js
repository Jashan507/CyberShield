const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userEmail: {
      type: String,
    },
    action: {
      type: String,
      enum: [
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_REGISTER',
        'INCIDENT_CREATED',
        'INCIDENT_UPDATED',
        'INCIDENT_DELETED',
        'VULNERABILITY_CREATED',
        'VULNERABILITY_UPDATED',
        'VULNERABILITY_DELETED',
        'USER_UPDATED',
        'USER_DELETED',
        'ROLE_CHANGED',
        'ADMIN_ACTION',
      ],
      required: true,
    },
    description: {
      type: String,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    resourceType: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
