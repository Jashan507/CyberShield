const User = require('../models/User');
const Incident = require('../models/Incident');
const Vulnerability = require('../models/Vulnerability');
const AuditLog = require('../models/AuditLog');
const createAuditLog = require('../utils/auditLogger');

// @desc  Get all users (paginated, searchable)
// @route GET /api/admin/users
// @access Private/Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, isActive } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: users.length,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      data: users,
    });
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get single user
// @route GET /api/admin/users/:id
// @access Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Update user
// @route PUT /api/admin/users/:id
// @access Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, role, isActive, department } = req.body;
    const previousRole = user.role;

    if (name !== undefined) user.name = name;
    if (isActive !== undefined) user.isActive = isActive;
    if (department !== undefined) user.department = department;
    if (role !== undefined) user.role = role;

    await user.save({ validateBeforeSave: false });

    const action = role && role !== previousRole ? 'ROLE_CHANGED' : 'USER_UPDATED';
    await createAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      action,
      description: `User ${user.email} updated by admin${role && role !== previousRole ? ` (role changed: ${previousRole} → ${role})` : ''}`,
      resourceId: user._id,
      resourceType: 'User',
      ipAddress: req.ip,
    });

    return res.status(200).json({ success: true, message: 'User updated', data: user });
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Delete user
// @route DELETE /api/admin/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();

    await createAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'USER_DELETED',
      description: `User ${user.email} deleted by admin`,
      resourceId: user._id,
      resourceType: 'User',
      ipAddress: req.ip,
    });

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get analytics dashboard data
// @route GET /api/admin/analytics
// @access Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      totalIncidents,
      openIncidents,
      resolvedIncidents,
      criticalIncidents,
      totalVulnerabilities,
      openVulnerabilities,
      patchedVulnerabilities,
      totalUsers,
      activeUsers,
      incidentsBySeverity,
      incidentsByCategory,
      incidentsByStatus,
      vulnerabilitiesBySeverity,
      monthlyIncidents,
      recentActivity,
    ] = await Promise.all([
      Incident.countDocuments(),
      Incident.countDocuments({ status: { $in: ['Submitted', 'Under Investigation', 'In Progress'] } }),
      Incident.countDocuments({ status: { $in: ['Resolved', 'Closed'] } }),
      Incident.countDocuments({ severity: 'Critical' }),
      Vulnerability.countDocuments(),
      Vulnerability.countDocuments({ status: 'Open' }),
      Vulnerability.countDocuments({ status: 'Patched' }),
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Incident.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
      Incident.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Incident.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Vulnerability.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
      Incident.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            _id: 0,
            month: {
              $concat: [
                { $toString: '$_id.year' }, '-',
                { $cond: [{ $lt: ['$_id.month', 10] }, { $concat: ['0', { $toString: '$_id.month' }] }, { $toString: '$_id.month' }] },
              ],
            },
            count: 1,
          },
        },
      ]),
      AuditLog.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalIncidents,
        openIncidents,
        resolvedIncidents,
        criticalIncidents,
        totalVulnerabilities,
        openVulnerabilities,
        patchedVulnerabilities,
        totalUsers,
        activeUsers,
        incidentsBySeverity,
        incidentsByCategory,
        incidentsByStatus,
        vulnerabilitiesBySeverity,
        monthlyIncidents,
        recentActivity,
      },
    });
  } catch (err) {
    console.error('getAnalytics error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get audit logs
// @route GET /api/admin/audit-logs
// @access Private/Admin
const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, userId, startDate, endDate, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: logs.length,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      data: logs,
    });
  } catch (err) {
    console.error('getAuditLogs (admin) error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser, getAnalytics, getAuditLogs };
