const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createVulnerability,
  getVulnerabilities,
  getVulnerability,
  updateVulnerability,
  deleteVulnerability,
} = require('../controllers/vulnerabilityController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const vulnValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('affectedSystem').trim().notEmpty().withMessage('Affected system is required'),
  body('vulnerabilityType')
    .notEmpty()
    .withMessage('Vulnerability type is required')
    .isIn(['SQL Injection','XSS','CSRF','Buffer Overflow','Authentication Bypass','Privilege Escalation','Information Disclosure','Misconfiguration','Outdated Software','Other'])
    .withMessage('Invalid vulnerability type'),
  body('severity')
    .notEmpty()
    .withMessage('Severity is required')
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid severity'),
  body('cvssScore').optional().isFloat({ min: 0, max: 10 }).withMessage('CVSS score must be between 0 and 10'),
];

router.post('/', protect, vulnValidators, validate, createVulnerability);
router.get('/', protect, getVulnerabilities);
router.get('/:id', protect, getVulnerability);
router.put('/:id', protect, updateVulnerability);
router.delete('/:id', protect, deleteVulnerability);

module.exports = router;
