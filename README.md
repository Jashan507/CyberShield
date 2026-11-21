# 🛡️ CyberShield – Cybersecurity Incident & Vulnerability Management System

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)

> A full-stack MERN application simulating a real-world Security Operations Center (SOC) management dashboard. Built as a college practical project demonstrating cybersecurity concepts and modern web development.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#️-database-schema)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Viva Questions](#-viva-questions--answers)
- [Project Demo Workflow](#-project-demonstration-workflow)
- [Author](#-author)

---

## 🔍 Project Overview

CyberShield is a centralized platform where security teams and end-users can report, track, and manage cybersecurity incidents and vulnerabilities. It simulates a real-world Security Operations Center (SOC) dashboard with role-based access control, audit logging, and security analytics.

The project demonstrates:
- Secure REST API design with Express.js
- JWT-based stateless authentication
- Role-Based Access Control (RBAC)
- MongoDB document modeling with Mongoose
- React SPA with protected routing and state management
- Multiple layers of security hardening (Helmet, rate limiting, sanitization)
- Audit trail for compliance and accountability

---

## ✨ Features

### Regular User
- 🔐 Secure JWT authentication (register, login, logout)
- 📋 Report cybersecurity incidents (Phishing, Malware, Unauthorized Access, etc.)
- 🐛 Document vulnerabilities with CVE ID and CVSS score
- 📊 Track report status through lifecycle (Submitted → Resolved)
- 🏠 Personal dashboard with incident/vulnerability history
- 👤 Profile management

### Administrator
- 📈 Complete admin dashboard with analytics and charts
- 👥 User management (view, activate/deactivate, delete users)
- 🗂️ Manage all incidents and vulnerabilities across users
- 🔍 Update incident status and add investigation notes
- 📜 View full audit logs of all system activity
- 📊 Security analytics with Recharts visualizations
- 🔎 Search, filter, and paginate all records

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Security** | Helmet, CORS, Rate Limiting, express-mongo-sanitize, xss-clean |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Dev Tools** | Nodemon, Vite HMR |

---

## 🏗️ Architecture

```
┌─────────────────────┐       REST API        ┌──────────────────────┐       ┌─────────────────┐
│   Client (React)    │ ───────────────────▶  │  Server (Express)    │ ────▶ │  MongoDB Atlas  │
│   Vite · Tailwind   │ ◀───────────────────  │  Node.js · Mongoose  │ ◀──── │  (Cloud)        │
└─────────────────────┘    JSON + JWT Token   └──────────────────────┘       └─────────────────┘
         │                                             │
         │  JWT stored in localStorage         Middleware Chain:
         │  Axios interceptor adds             1. helmet() – secure headers
         │  Authorization header               2. cors()  – origin whitelist
         │  on every request                   3. rateLimiter – brute force protection
         │                                     4. mongoSanitize() – NoSQL injection
                                               5. xssClean() – XSS protection
                                               6. auth middleware – JWT verify
                                               7. adminOnly – RBAC check
                                               8. express-validator – input validation
                                               9. controller – business logic
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (free M0 tier works perfectly)
- **Git**

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/cybershield.git
cd cybershield
```

**2. Install backend dependencies:**
```bash
cd server
npm install
```

**3. Install frontend dependencies:**
```bash
cd ../client
npm install
```

**4. Configure environment variables:**
```bash
# In server/ directory:
cp .env.example .env
# Open server/.env and fill in your MongoDB URI and JWT secret

# In client/ directory:
cp .env.example .env
# VITE_API_URL is already set to http://localhost:5000/api for local dev
```

**5. Seed the database with sample data:**
```bash
cd server
npm run seed
```

**6. Start development servers (two terminals):**
```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

**7. Open your browser:** `http://localhost:5173`

---

### 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@cybershield.com | Admin@123456 |
| **User** | alice@example.com | User@123456 |
| **User** | bob@example.com | User@123456 |

> ⚠️ These credentials are created by the seed script. Change them in production.

---

## 🔐 Environment Variables

### `server/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server listening port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/cybershield` |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 chars) | `your-long-random-secret-key` |
| `JWT_EXPIRE` | JWT token expiry duration | `7d` |
| `NODE_ENV` | Runtime environment | `development` |
| `CLIENT_URL` | Frontend URL for CORS whitelist | `http://localhost:5173` |
| `ADMIN_EMAIL` | Seed admin email | `admin@cybershield.com` |
| `ADMIN_PASSWORD` | Seed admin password | `Admin@123456` |

### `client/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

> 🔒 **Never commit `.env` files to Git.** The `.gitignore` excludes them automatically.

---

## 📡 API Documentation

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>` header.

### Authentication — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/register` | Register new user account | ❌ |
| `POST` | `/login` | Login and receive JWT | ❌ |
| `POST` | `/logout` | Logout (audit logged) | ✅ |
| `GET` | `/me` | Get current user profile | ✅ |
| `PUT` | `/me` | Update profile | ✅ |
| `PUT` | `/change-password` | Change password | ✅ |

### Incidents — `/api/incidents`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/` | Create new incident report | User/Admin |
| `GET` | `/` | List incidents (own or all for admin) | User/Admin |
| `GET` | `/:id` | Get single incident details | Owner/Admin |
| `PUT` | `/:id` | Update incident | Owner/Admin |
| `DELETE` | `/:id` | Delete incident | Owner/Admin |
| `POST` | `/:id/notes` | Add investigation note | Admin |

### Vulnerabilities — `/api/vulnerabilities`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/` | Report new vulnerability | User/Admin |
| `GET` | `/` | List vulnerabilities | User/Admin |
| `GET` | `/:id` | Get vulnerability details | Owner/Admin |
| `PUT` | `/:id` | Update vulnerability | Owner/Admin |
| `DELETE` | `/:id` | Delete vulnerability | Owner/Admin |

### Admin — `/api/admin`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/users` | List all users with pagination | Admin only |
| `GET` | `/users/:id` | Get user details | Admin only |
| `PUT` | `/users/:id` | Update user (role, status) | Admin only |
| `DELETE` | `/users/:id` | Delete user | Admin only |
| `GET` | `/analytics` | Security analytics data | Admin only |
| `GET` | `/audit-logs` | Paginated audit log | Admin only |

### Query Parameters (list endpoints)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page |
| `search` | string | — | Text search |
| `status` | string | — | Filter by status |
| `severity` | string | — | Filter by severity |
| `category` | string | — | Filter by category |
| `sortBy` | string | `createdAt` | Sort field |
| `sortOrder` | string | `desc` | `asc` or `desc` |

---

## 🗄️ Database Schema

### Users Collection
```js
{
  name:        String (required),
  email:       String (required, unique, lowercase),
  password:    String (hashed, not returned in queries),
  role:        'user' | 'admin',
  isActive:    Boolean (default: true),
  department:  String,
  avatar:      String (URL),
  lastLogin:   Date,
  loginCount:  Number,
  createdAt:   Date,
  updatedAt:   Date
}
```

### Incidents Collection
```js
{
  title:              String (required),
  description:        String (required),
  category:           'Phishing Attack' | 'Malware Infection' | 'Unauthorized Access' |
                      'Data Breach' | 'Suspicious Activity' | 'Ransomware' |
                      'Social Engineering' | 'Other',
  severity:           'Low' | 'Medium' | 'High' | 'Critical',
  status:             'Submitted' | 'Under Investigation' | 'In Progress' | 'Resolved' | 'Closed',
  affectedSystem:     String (required),
  dateOccurred:       Date (required),
  evidence:           String (file path/URL, optional),
  reportedBy:         ObjectId → User,
  assignedTo:         ObjectId → User,
  investigationNotes: [{ note: String, addedBy: ObjectId, addedAt: Date }],
  resolvedAt:         Date,
  createdAt:          Date,
  updatedAt:          Date
}
```

### Vulnerabilities Collection
```js
{
  title:              String (required),
  description:        String (required),
  affectedSystem:     String (required),
  vulnerabilityType:  'SQL Injection' | 'XSS' | 'CSRF' | 'Buffer Overflow' |
                      'Authentication Bypass' | 'Privilege Escalation' |
                      'Information Disclosure' | 'Misconfiguration' |
                      'Outdated Software' | 'Other',
  severity:           'Low' | 'Medium' | 'High' | 'Critical',
  status:             'Open' | 'Under Review' | 'Patched' | 'Accepted Risk',
  cveId:              String (optional, e.g. CVE-2024-1234),
  cvssScore:          Number (0.0 – 10.0),
  remediationSteps:   String,
  reportedBy:         ObjectId → User,
  patchedAt:          Date,
  createdAt:          Date,
  updatedAt:          Date
}
```

### AuditLogs Collection
```js
{
  userId:        ObjectId → User,
  userEmail:     String,
  action:        String (e.g. 'USER_LOGIN', 'INCIDENT_CREATED', 'STATUS_UPDATED'),
  description:   String,
  resourceId:    String,
  resourceType:  String (e.g. 'Incident', 'Vulnerability', 'User'),
  ipAddress:     String,
  createdAt:     Date
}
```

---

## 🔒 Security Features

| Feature | Implementation | Detail |
|---------|----------------|--------|
| **Password Hashing** | bcryptjs | Salt rounds = 12, plain-text never stored |
| **Authentication** | JWT Bearer tokens | 7-day expiry, signed with strong secret |
| **Authorization** | RBAC middleware | `auth` + `adminOnly` middleware chain |
| **Input Validation** | express-validator | All POST/PUT routes validated |
| **NoSQL Injection** | express-mongo-sanitize | Strips `$` and `.` from request data |
| **XSS Protection** | xss-clean | Sanitizes HTML entities in input |
| **Rate Limiting** | express-rate-limit | 10 login attempts per 15 minutes per IP |
| **Secure Headers** | Helmet.js | 11 security headers set automatically |
| **CORS** | cors package | Whitelist-only: `CLIENT_URL` env variable |
| **Error Handling** | Global error handler | Stack traces hidden in production |
| **Audit Logging** | Custom middleware | All sensitive operations recorded |
| **Data Limit** | express.json | Request body capped at 10kb |

---

## 📁 Project Structure

```
cybershield/
├── .gitignore
├── package.json              ← Monorepo convenience scripts
├── README.md
│
├── server/                   ← Node.js / Express backend
│   ├── package.json
│   ├── .env.example
│   ├── server.js             ← App entry point
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Incident.js
│   │   ├── Vulnerability.js
│   │   └── AuditLog.js
│   ├── middleware/
│   │   ├── auth.js           ← JWT verification
│   │   ├── adminOnly.js      ← RBAC admin guard
│   │   ├── rateLimiter.js    ← Login rate limiting
│   │   └── validate.js       ← express-validator handler
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── incidentController.js
│   │   ├── vulnerabilityController.js
│   │   ├── adminController.js
│   │   └── auditLogController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── incidents.js
│   │   ├── vulnerabilities.js
│   │   └── admin.js
│   ├── utils/
│   │   ├── auditLogger.js    ← Audit log helper
│   │   └── generateToken.js  ← JWT generation
│   └── seed/
│       └── seed.js           ← Database seeder
│
└── client/                   ← React / Vite frontend
    ├── package.json
    ├── .env.example
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── axios.js      ← Axios instance with interceptors
        ├── contexts/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Layout/
        │   ├── UI/
        │   └── Charts/
        └── pages/
            ├── auth/
            ├── user/
            └── admin/
```

---

## 🌐 Deployment

### Backend — Render (Free Tier)
1. Push code to GitHub
2. Create **New Web Service** on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set **Build Command**: `cd server && npm install`
5. Set **Start Command**: `cd server && npm start`
6. Add all environment variables from `server/.env` in the Render dashboard
7. Deploy — Render provides a `.onrender.com` URL

### Frontend — Vercel (Free Tier)
1. Import project on [vercel.com](https://vercel.com)
2. Set **Root Directory**: `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-app-name.onrender.com/api
   ```
6. Deploy

### Database — MongoDB Atlas (Free M0 Cluster)
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free **M0 cluster**
3. Add a **Database User** (username + strong password)
4. Under **Network Access** → Add IP: `0.0.0.0/0` (required for Render)
5. Click **Connect** → **Connect your application** → copy connection string
6. Replace `<password>` in the string and add to `MONGODB_URI` env var

---

## 🧪 Testing

### API Testing with Postman
Test the full authentication and authorization flow:

1. **Register** `POST /api/auth/register` with name, email, password
2. **Login** `POST /api/auth/login` → copy the returned JWT token
3. Set `Authorization: Bearer <token>` header in Postman environment
4. **Create Incident** `POST /api/incidents` with incident data
5. **Get Incidents** `GET /api/incidents` — verify only own incidents for user
6. **Admin Route** `GET /api/admin/users` — verify 403 as regular user
7. **Login as Admin** → retry admin routes → verify access granted

### Manual Test Scenarios

| # | Scenario | Expected Result |
|---|----------|----------------|
| 1 | Register with duplicate email | `400 Email already exists` |
| 2 | Login with wrong password | `401 Invalid credentials` |
| 3 | Login 10+ times with wrong password | `429 Too Many Requests` |
| 4 | Access `/api/admin/*` as regular user | `403 Admin access required` |
| 5 | Send request with expired token | `401 Token expired` |
| 6 | Create incident as user → check dashboard | Incident appears with "Submitted" status |
| 7 | Admin updates incident status | Audit log entry created |
| 8 | Send `{"email": {"$gt": ""}}` as login email | Sanitized, no bypass |
| 9 | Deactivate user → user tries to login | `403 Account deactivated` |
| 10 | View audit logs as admin | All events listed chronologically |

---

## 🎓 Viva Questions & Answers

**Q1: What is JWT and how is it used in this project?**

A: JWT (JSON Web Token) is a compact, URL-safe token format used for stateless authentication. In CyberShield, after a successful login, the server signs a JWT with a secret key — the payload contains the user's ID and role. The client stores this token in `localStorage` and attaches it to every API request via the `Authorization: Bearer <token>` header. The server's `auth` middleware verifies the signature on every protected request to authenticate the user, without needing server-side sessions or a database lookup for every request.

---

**Q2: What is bcrypt and why do we use it for passwords?**

A: bcrypt is a cryptographic hashing function designed specifically for passwords. It incorporates a random **salt** (preventing rainbow table attacks) and an intentional **cost factor** that makes it computationally slow — meaning even if the database is stolen, brute-forcing hashes takes years. In CyberShield, bcryptjs hashes passwords with **12 salt rounds** before storing them. Plain-text passwords are **never** stored. During login, the entered password is compared against the stored hash using `bcrypt.compare()`.

---

**Q3: What is Role-Based Access Control (RBAC)?**

A: RBAC is an authorization strategy that restricts system access based on roles assigned to users. CyberShield has two roles: `user` and `admin`. Regular users can only view and manage their own incidents and vulnerabilities. Admins have full access to all data, user management, analytics, and audit logs. This is enforced server-side by the `adminOnly` middleware, which checks `req.user.role === 'admin'` after the JWT is verified — no frontend-only protection is ever trusted.

---

**Q4: What is NoSQL injection and how is it prevented?**

A: NoSQL injection involves sending malicious MongoDB operators (like `$gt`, `$where`, `$ne`) in request fields to manipulate database queries. For example, sending `{"email": {"$gt": ""}, "password": {"$gt": ""}}` to a login endpoint could potentially bypass authentication by matching any document. CyberShield uses `express-mongo-sanitize`, which strips `$` and `.` characters from all request body, query, and param fields before they reach any controller or database query.

---

**Q5: What is an audit log and why is it important?**

A: An audit log is a chronological, immutable record of all significant events in a system. In CyberShield, every login, logout, incident creation, status change, and admin action is recorded in the `AuditLog` collection with the user's ID, email, action type, description, affected resource, and IP address. This provides: **accountability** (who did what), **forensics** (trace events after an incident), **compliance** (required by SOC 2, ISO 27001, GDPR), and **anomaly detection** (spot unusual patterns).

---

**Q6: What is rate limiting and why is it important?**

A: Rate limiting restricts how many requests a client (identified by IP address) can make in a given time window. Without it, an attacker can try thousands of password combinations per minute in a **brute-force attack**. CyberShield limits login attempts to **10 per 15 minutes per IP** using `express-rate-limit`. After the limit is exceeded, the server returns `429 Too Many Requests` and the attacker must wait — making automated attacks impractical.

---

**Q7: What is Helmet.js?**

A: Helmet is an Express middleware package that automatically sets **11 HTTP security response headers** to protect against common web vulnerabilities:
- `X-XSS-Protection` — basic XSS filter in older browsers
- `X-Frame-Options: DENY` — prevents clickjacking attacks
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- `Strict-Transport-Security` — enforces HTTPS connections
- `Content-Security-Policy` — restricts resource loading origins
- `Referrer-Policy` — controls referrer information sent

---

**Q8: Explain the MERN stack.**

A: MERN is a full-stack JavaScript framework consisting of four technologies:
- **M**ongoDB — NoSQL document database (flexible JSON-like storage)
- **E**xpress.js — Minimal Node.js web framework for building REST APIs
- **R**eact — Frontend JavaScript library for building component-based UIs
- **N**ode.js — JavaScript runtime that powers the server-side code

Using one language (JavaScript/TypeScript) across the entire stack simplifies development, enables code sharing, and allows the same developer to work on both frontend and backend.

---

**Q9: What is the difference between authentication and authorization?**

A: 
- **Authentication** = Verifying *who you are*. In CyberShield: submitting email+password, receiving a JWT, and the server verifying that JWT on each request.
- **Authorization** = Determining *what you can do*. In CyberShield: checking if the authenticated user has the `admin` role before allowing access to `/api/admin/*` routes, or verifying that a user owns an incident before allowing them to edit it.

Authentication always comes first. Authorization uses the identity established by authentication.

---

**Q10: How does CORS work in this project?**

A: CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making requests to a different domain than the one that served the page. Without proper CORS configuration, the React frontend (port 5173) could not call the Express API (port 5000). CyberShield configures the `cors` middleware with `origin: process.env.CLIENT_URL` — only requests from that exact origin are allowed. The `credentials: true` option allows cookies/auth headers to be included. This prevents malicious third-party websites from silently making authenticated API calls on behalf of logged-in users.

---

## 👨‍💻 Project Demonstration Workflow

For the college demo, follow this sequence to showcase all features:

| Step | Action | What it demonstrates |
|------|--------|---------------------|
| 1 | Open `http://localhost:5173`, show landing page | Project overview |
| 2 | Register a new account live | Registration + validation |
| 3 | Login as new user, show dashboard | JWT auth flow |
| 4 | Report a new Phishing Attack (High severity) | Core user feature |
| 5 | Show incident in list with "Submitted" status | Real-time data |
| 6 | Logout → login as `admin@cybershield.com` | Role switching |
| 7 | Show Admin Dashboard with analytics charts | Admin features |
| 8 | Update incident status → "Under Investigation" + add note | Status management |
| 9 | Navigate to Audit Logs — show the status change entry | Audit logging |
| 10 | Show User Management — toggle user active/inactive | RBAC |
| 11 | Show Analytics page with all Recharts visualizations | Data visualization |
| 12 | Attempt 10+ failed logins → show 429 response | Rate limiting |
| 13 | Open Browser DevTools → Network tab → show JWT in header | JWT transport |
| 14 | Show `.env.example` → explain secrets management | Security best practices |

---

## 👤 Author

**[Your Name]**  
[College Name]  
[Department]  
Academic Year: [Year]

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for academic demonstration of cybersecurity and full-stack web development concepts.*
