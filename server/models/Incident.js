const mongoose = require('mongoose');

const investigationNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Phishing Attack',
        'Malware Infection',
        'Unauthorized Access',
        'Data Breach',
        'Suspicious Activity',
        'Ransomware',
        'Social Engineering',
        'Other',
      ],
      required: [true, 'Category is required'],
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: [true, 'Severity is required'],
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Investigation', 'In Progress', 'Resolved', 'Closed'],
      default: 'Submitted',
    },
    affectedSystem: {
      type: String,
      required: [true, 'Affected system is required'],
      trim: true,
    },
    dateOccurred: {
      type: Date,
      required: [true, 'Date occurred is required'],
    },
    evidence: {
      type: String,
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    investigationNotes: [investigationNoteSchema],
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes
incidentSchema.index({ reportedBy: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ severity: 1 });
incidentSchema.index({ category: 1 });

module.exports = mongoose.model('Incident', incidentSchema);
