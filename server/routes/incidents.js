const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createIncident,
  getIncidents,
  getIncident,
  updateIncident,
  deleteIncident,
} = require('../controllers/incidentController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const incidentValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Phishing Attack','Malware Infection','Unauthorized Access','Data Breach','Suspicious Activity','Ransomware','Social Engineering','Other'])
    .withMessage('Invalid category'),
  body('severity')
    .notEmpty()
    .withMessage('Severity is required')
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid severity'),
  body('affectedSystem').trim().notEmpty().withMessage('Affected system is required'),
  body('dateOccurred').notEmpty().withMessage('Date occurred is required').isISO8601().withMessage('Invalid date format'),
];

router.post('/', protect, incidentValidators, validate, createIncident);
router.get('/', protect, getIncidents);
router.get('/:id', protect, getIncident);
router.put('/:id', protect, updateIncident);
router.delete('/:id', protect, deleteIncident);

module.exports = router;
