require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Incident = require('../models/Incident');
const Vulnerability = require('../models/Vulnerability');
const AuditLog = require('../models/AuditLog');

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Incident.deleteMany(),
      Vulnerability.deleteMany(),
      AuditLog.deleteMany(),
    ]);
    console.log('Cleared existing data.');

    // ─── Users ────────────────────────────────────────────────────────────────
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@cybershield.com',
      password: 'Admin@123456',
      role: 'admin',
      department: 'Security Operations',
      isActive: true,
    });

    const alice = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'User@123456',
      role: 'user',
      department: 'Engineering',
      isActive: true,
    });

    const bob = await User.create({
      name: 'Bob Martinez',
      email: 'bob@example.com',
      password: 'User@123456',
      role: 'user',
      department: 'Finance',
      isActive: true,
    });

    const charlie = await User.create({
      name: 'Charlie Kim',
      email: 'charlie@example.com',
      password: 'User@123456',
      role: 'user',
      department: 'HR',
      isActive: true,
    });

    console.log('Users seeded: admin, alice, bob, charlie');

    // ─── Incidents ────────────────────────────────────────────────────────────
    const incidents = await Incident.insertMany([
      {
        title: 'Phishing Email Targeting Finance Team',
        description: 'Multiple employees in the Finance department received a spoofed email impersonating the CEO requesting wire transfers.',
        category: 'Phishing Attack',
        severity: 'High',
        status: 'Under Investigation',
        affectedSystem: 'Email (Microsoft 365)',
        dateOccurred: new Date('2024-11-10'),
        reportedBy: bob._id,
        assignedTo: admin._id,
        investigationNotes: [
          { note: 'Email headers traced to external spoofed domain. Blocking at mail gateway initiated.', addedBy: admin._id, addedAt: new Date('2024-11-11') },
        ],
      },
      {
        title: 'Ransomware Detected on Workstation WS-042',
        description: 'Ransomware variant LockBit 3.0 detected on workstation WS-042 in Engineering. Files encrypted. Network segmented immediately.',
        category: 'Ransomware',
        severity: 'Critical',
        status: 'In Progress',
        affectedSystem: 'Workstation WS-042 (Engineering Floor)',
        dateOccurred: new Date('2024-11-12'),
        reportedBy: alice._id,
        assignedTo: admin._id,
        investigationNotes: [
          { note: 'Machine isolated. Forensic image taken. Backup restoration in progress.', addedBy: admin._id, addedAt: new Date('2024-11-12') },
        ],
      },
      {
        title: 'Unauthorized SSH Access Attempt on Production Server',
        description: 'Repeated brute-force SSH attempts detected on prod-server-01 from an external IP address. Fail2ban triggered after 50 attempts.',
        category: 'Unauthorized Access',
        severity: 'High',
        status: 'Resolved',
        affectedSystem: 'Production Server (prod-server-01)',
        dateOccurred: new Date('2024-11-05'),
        resolvedAt: new Date('2024-11-06'),
        reportedBy: alice._id,
        assignedTo: admin._id,
        investigationNotes: [
          { note: 'IP blocked at firewall level. No successful login detected. SSH key-only auth enforced.', addedBy: admin._id, addedAt: new Date('2024-11-06') },
        ],
      },
      {
        title: 'Suspicious Data Exfiltration Activity',
        description: 'SIEM alert triggered for large volume data transfer (>50GB) to an external cloud storage service from an internal IP.',
        category: 'Data Breach',
        severity: 'Critical',
        status: 'Under Investigation',
        affectedSystem: 'Internal Network / SIEM',
        dateOccurred: new Date('2024-11-14'),
        reportedBy: admin._id,
        assignedTo: admin._id,
      },
      {
        title: 'Malware Found in Email Attachment (Marketing Dept)',
        description: 'Antivirus flagged a macro-enabled Word document in an email attachment. Document contained a dropper for Emotet trojan.',
        category: 'Malware Infection',
        severity: 'Medium',
        status: 'Resolved',
        affectedSystem: 'Endpoint (Marketing-PC-07)',
        dateOccurred: new Date('2024-11-01'),
        resolvedAt: new Date('2024-11-02'),
        reportedBy: charlie._id,
      },
      {
        title: 'Social Engineering Call Targeting IT Helpdesk',
        description: 'An unknown caller impersonated a senior executive and attempted to get IT helpdesk to reset credentials without verification.',
        category: 'Social Engineering',
        severity: 'Medium',
        status: 'Closed',
        affectedSystem: 'IT Helpdesk Process',
        dateOccurred: new Date('2024-10-28'),
        resolvedAt: new Date('2024-10-29'),
        reportedBy: charlie._id,
        investigationNotes: [
          { note: 'Helpdesk staff training refreshed. Verification procedures updated.', addedBy: admin._id, addedAt: new Date('2024-10-29') },
        ],
      },
      {
        title: 'Anomalous Login from Unusual Geography',
        description: 'User account alice@example.com logged in from an IP geolocated to Eastern Europe at 03:00 AM local time.',
        category: 'Suspicious Activity',
        severity: 'Low',
        status: 'Submitted',
        affectedSystem: 'Identity Provider (Okta)',
        dateOccurred: new Date('2024-11-15'),
        reportedBy: alice._id,
      },
      {
        title: 'Internal Network Scan Detected',
        description: 'Port scan from an internal IP address covering subnets 192.168.1.0/24 and 192.168.2.0/24 detected via IDS.',
        category: 'Suspicious Activity',
        severity: 'Medium',
        status: 'Submitted',
        affectedSystem: 'Internal Network',
        dateOccurred: new Date('2024-11-16'),
        reportedBy: bob._id,
      },
    ]);

    console.log(`Incidents seeded: ${incidents.length}`);

    // ─── Vulnerabilities ──────────────────────────────────────────────────────
    const vulnerabilities = await Vulnerability.insertMany([
      {
        title: 'SQL Injection in User Search Endpoint',
        description: 'The /api/users/search endpoint does not sanitize query parameters, allowing SQL injection attacks that could expose the entire user database.',
        affectedSystem: 'User Management API',
        vulnerabilityType: 'SQL Injection',
        severity: 'Critical',
        status: 'Open',
        cveId: 'CVE-2024-11001',
        cvssScore: 9.8,
        remediationSteps: 'Use parameterized queries or an ORM. Validate and sanitize all user inputs. Apply WAF rules.',
        reportedBy: alice._id,
      },
      {
        title: 'Stored XSS in Incident Comment Field',
        description: 'The investigation notes field in the incident management system renders HTML without escaping, enabling stored XSS attacks.',
        affectedSystem: 'Incident Management Portal',
        vulnerabilityType: 'XSS',
        severity: 'High',
        status: 'Under Review',
        cvssScore: 7.5,
        remediationSteps: 'Implement output encoding using a library like DOMPurify. Apply Content Security Policy headers.',
        reportedBy: bob._id,
      },
      {
        title: 'Outdated OpenSSL Version (1.0.2) on Legacy Server',
        description: 'The legacy reporting server runs OpenSSL 1.0.2 which is end-of-life and has multiple known critical vulnerabilities including Heartbleed variants.',
        affectedSystem: 'Legacy Reporting Server (report-srv-02)',
        vulnerabilityType: 'Outdated Software',
        severity: 'Critical',
        status: 'Patched',
        cveId: 'CVE-2024-5535',
        cvssScore: 9.1,
        remediationSteps: 'Upgrade OpenSSL to 3.x. Recompile dependent applications. Test thoroughly.',
        reportedBy: admin._id,
        patchedAt: new Date('2024-11-08'),
      },
      {
        title: 'Missing CSRF Protection on Account Settings',
        description: 'Account settings endpoints do not validate CSRF tokens, allowing cross-site request forgery attacks to change user email or password.',
        affectedSystem: 'Web Application (Account Settings)',
        vulnerabilityType: 'CSRF',
        severity: 'Medium',
        status: 'Open',
        cvssScore: 6.1,
        remediationSteps: 'Implement SameSite=Strict cookie attribute and CSRF tokens on all state-changing requests.',
        reportedBy: charlie._id,
      },
      {
        title: 'Privilege Escalation via Misconfigured Sudo Rules',
        description: 'A developer account has sudo privileges to run python3 without password, allowing arbitrary code execution as root.',
        affectedSystem: 'Linux App Server (app-srv-01)',
        vulnerabilityType: 'Privilege Escalation',
        severity: 'High',
        status: 'Patched',
        cvssScore: 8.8,
        remediationSteps: 'Audit and restrict /etc/sudoers. Remove unnecessary sudo privileges. Enable sudo logging.',
        reportedBy: alice._id,
        patchedAt: new Date('2024-11-10'),
      },
      {
        title: 'S3 Bucket with Public Read Access Contains Sensitive Logs',
        description: 'Application logs stored in S3 bucket "app-logs-prod" are publicly readable due to misconfigured bucket policy, exposing user IDs and IP addresses.',
        affectedSystem: 'AWS S3 (app-logs-prod)',
        vulnerabilityType: 'Misconfiguration',
        severity: 'High',
        status: 'Under Review',
        cvssScore: 7.5,
        remediationSteps: 'Set bucket ACL to private. Enable S3 Block Public Access settings. Review IAM policies. Enable CloudTrail.',
        reportedBy: bob._id,
      },
    ]);

    console.log(`Vulnerabilities seeded: ${vulnerabilities.length}`);

    // ─── Audit Logs ───────────────────────────────────────────────────────────
    const auditLogs = await AuditLog.insertMany([
      {
        userId: admin._id,
        userEmail: 'admin@cybershield.com',
        action: 'USER_LOGIN',
        description: 'Admin logged in',
        resourceId: admin._id,
        resourceType: 'User',
        ipAddress: '192.168.1.100',
        createdAt: new Date('2024-11-16T08:00:00Z'),
      },
      {
        userId: alice._id,
        userEmail: 'alice@example.com',
        action: 'USER_REGISTER',
        description: 'User alice registered',
        resourceId: alice._id,
        resourceType: 'User',
        ipAddress: '192.168.1.101',
        createdAt: new Date('2024-11-01T09:00:00Z'),
      },
      {
        userId: alice._id,
        userEmail: 'alice@example.com',
        action: 'INCIDENT_CREATED',
        description: 'Incident created: Ransomware Detected on Workstation WS-042',
        resourceId: incidents[1]._id,
        resourceType: 'Incident',
        ipAddress: '192.168.1.101',
        createdAt: new Date('2024-11-12T10:30:00Z'),
      },
      {
        userId: bob._id,
        userEmail: 'bob@example.com',
        action: 'INCIDENT_CREATED',
        description: 'Incident created: Phishing Email Targeting Finance Team',
        resourceId: incidents[0]._id,
        resourceType: 'Incident',
        ipAddress: '192.168.1.102',
        createdAt: new Date('2024-11-10T14:00:00Z'),
      },
      {
        userId: admin._id,
        userEmail: 'admin@cybershield.com',
        action: 'INCIDENT_UPDATED',
        description: 'Incident updated: Unauthorized SSH Access Attempt — status changed to Resolved',
        resourceId: incidents[2]._id,
        resourceType: 'Incident',
        ipAddress: '192.168.1.100',
        createdAt: new Date('2024-11-06T11:00:00Z'),
      },
      {
        userId: alice._id,
        userEmail: 'alice@example.com',
        action: 'VULNERABILITY_CREATED',
        description: 'Vulnerability created: SQL Injection in User Search Endpoint',
        resourceId: vulnerabilities[0]._id,
        resourceType: 'Vulnerability',
        ipAddress: '192.168.1.101',
        createdAt: new Date('2024-11-13T09:00:00Z'),
      },
      {
        userId: admin._id,
        userEmail: 'admin@cybershield.com',
        action: 'VULNERABILITY_UPDATED',
        description: 'Vulnerability updated: Outdated OpenSSL — status changed to Patched',
        resourceId: vulnerabilities[2]._id,
        resourceType: 'Vulnerability',
        ipAddress: '192.168.1.100',
        createdAt: new Date('2024-11-08T16:00:00Z'),
      },
      {
        userId: admin._id,
        userEmail: 'admin@cybershield.com',
        action: 'ROLE_CHANGED',
        description: 'No role change in this entry — admin verified user accounts',
        resourceId: admin._id,
        resourceType: 'User',
        ipAddress: '192.168.1.100',
        createdAt: new Date('2024-11-02T10:00:00Z'),
      },
      {
        userId: charlie._id,
        userEmail: 'charlie@example.com',
        action: 'USER_LOGIN',
        description: 'User charlie logged in',
        resourceId: charlie._id,
        resourceType: 'User',
        ipAddress: '192.168.1.103',
        createdAt: new Date('2024-11-15T08:30:00Z'),
      },
      {
        userId: bob._id,
        userEmail: 'bob@example.com',
        action: 'USER_LOGOUT',
        description: 'User bob logged out',
        resourceId: bob._id,
        resourceType: 'User',
        ipAddress: '192.168.1.102',
        createdAt: new Date('2024-11-16T17:00:00Z'),
      },
    ]);

    console.log(`Audit logs seeded: ${auditLogs.length}`);
    console.log('\n✅ Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin credentials:');
    console.log('  Email:    admin@cybershield.com');
    console.log('  Password: Admin@123456');
    console.log('User credentials (alice/bob/charlie):');
    console.log('  Password: User@123456');
    console.log('─────────────────────────────────');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  }
};

seed();
