const Incident = require('../models/Incident');
const createAuditLog = require('../utils/auditLogger');

// @desc  Create incident
// @route POST /api/incidents
// @access Private
const createIncident = async (req, res) => {
  try {
    const { title, description, category, severity, affectedSystem, dateOccurred, evidence } = req.body;

    const incident = await Incident.create({
      title,
      description,
      category,
      severity,
      affectedSystem,
      dateOccurred,
      evidence,
      reportedBy: req.user.id,
    });

    await createAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'INCIDENT_CREATED',
      description: `Incident created: ${incident.title}`,
      resourceId: incident._id,
      resourceType: 'Incident',
      ipAddress: req.ip,
    });

    return res.status(201).json({ success: true, message: 'Incident created', data: incident });
  } catch (err) {
    console.error('createIncident error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get incidents
// @route GET /api/incidents
// @access Private
const getIncidents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, severity, category, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};

    // Non-admin users only see their own
    if (req.user.role !== 'admin') {
      filter.reportedBy = req.user.id;
    }

    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Incident.countDocuments(filter);
    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'name email department')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      count: incidents.length,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
      data: incidents,
    });
  } catch (err) {
    console.error('getIncidents error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Get single incident
// @route GET /api/incidents/:id
// @access Private
const getIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'name email department')
      .populate('assignedTo', 'name email department')
      .populate('investigationNotes.addedBy', 'name email');

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Non-admin users can only view their own incidents
    if (req.user.role !== 'admin' && incident.reportedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({ success: true, data: incident });
  } catch (err) {
    console.error('getIncident error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Update incident
// @route PUT /api/incidents/:id
// @access Private
const updateIncident = async (req, res) => {
  try {
    let incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    if (req.user.role === 'admin') {
      // Admin can update any field
      const { title, description, category, severity, affectedSystem, dateOccurred, evidence,
              status, assignedTo, investigationNotes, resolvedAt } = req.body;

      if (title !== undefined) incident.title = title;
      if (description !== undefined) incident.description = description;
      if (category !== undefined) incident.category = category;
      if (severity !== undefined) incident.severity = severity;
      if (affectedSystem !== undefined) incident.affectedSystem = affectedSystem;
      if (dateOccurred !== undefined) incident.dateOccurred = dateOccurred;
      if (evidence !== undefined) incident.evidence = evidence;
      if (status !== undefined) {
        incident.status = status;
        if (status === 'Resolved' || status === 'Closed') {
          incident.resolvedAt = resolvedAt || new Date();
        }
      }
      if (assignedTo !== undefined) incident.assignedTo = assignedTo;
      if (resolvedAt !== undefined) incident.resolvedAt = resolvedAt;

      if (req.body.newNote || req.body.addNote) {
        incident.investigationNotes.push({
          note: req.body.newNote || req.body.addNote,
          addedBy: req.user.id,
          addedAt: new Date(),
        });
      }
    } else {
      // Regular user: can only update own incidents in Submitted status
      if (incident.reportedBy.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (incident.status !== 'Submitted') {
        return res.status(400).json({ success: false, message: 'You can only edit incidents in Submitted status' });
      }

      const { title, description, category, severity, affectedSystem, dateOccurred } = req.body;
      if (title !== undefined) incident.title = title;
      if (description !== undefined) incident.description = description;
      if (category !== undefined) incident.category = category;
      if (severity !== undefined) incident.severity = severity;
      if (affectedSystem !== undefined) incident.affectedSystem = affectedSystem;
      if (dateOccurred !== undefined) incident.dateOccurred = dateOccurred;
    }

    await incident.save();

    await createAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'INCIDENT_UPDATED',
      description: `Incident updated: ${incident.title}`,
      resourceId: incident._id,
      resourceType: 'Incident',
      ipAddress: req.ip,
    });

    return res.status(200).json({ success: true, message: 'Incident updated', data: incident });
  } catch (err) {
    console.error('updateIncident error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Delete incident
// @route DELETE /api/incidents/:id
// @access Private
const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Admin can delete any; user can only delete own submitted incidents
    if (req.user.role !== 'admin') {
      if (incident.reportedBy.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (incident.status !== 'Submitted') {
        return res.status(400).json({ success: false, message: 'Only submitted incidents can be deleted by users' });
      }
    }

    await incident.deleteOne();

    await createAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'INCIDENT_DELETED',
      description: `Incident deleted: ${incident.title}`,
      resourceId: incident._id,
      resourceType: 'Incident',
      ipAddress: req.ip,
    });

    return res.status(200).json({ success: true, message: 'Incident deleted successfully' });
  } catch (err) {
    console.error('deleteIncident error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createIncident, getIncidents, getIncident, updateIncident, deleteIncident };
