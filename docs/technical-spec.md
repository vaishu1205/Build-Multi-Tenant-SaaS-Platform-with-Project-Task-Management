# Technical Specification Document

## Multi-Tenant SaaS Platform - Project & Task Management

---

## 1. Project Structure

### 1.1 Backend Structure

```
backend/
├── src/
│   ├── controllers/           # Request handlers and business logic
│   │   ├── auth.controller.js
│   │   ├── tenant.controller.js
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   └── task.controller.js
│   │
│   ├── routes/                # API route definitions
│   │   ├── auth.routes.js
│   │   ├── tenant.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   ├── health.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.js      # JWT verification
│   │   └── authorize.js            # Role-based access control
│   │
│   ├── config/                # Configuration files
│   │   ├── db.js                   # Database connection pool
│   │   └── env.js                  # Environment variables loader
│   │
│   ├── utils/                 # Utility functions
│   │   └── migrate.js              # Database migration runner
│   │
│   ├── seeds/                 # Database seed data
│   │   └── seed.js                 # Initial data seeding
│   │
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
│
├── migrations/                # SQL migration files
│   ├── 001_create_tenants.sql
│   ├── 002_create_users.sql
│   ├── 003_create_projects.sql
│   ├── 004_create_tasks.sql
│   └── 005_create_audit_logs.sql
│
├── .env                       # Environment variables
├── .gitignore
├── Dockerfile                 # Backend Docker image
├── package.json
└── package-lock.json
```

### 1.2 Frontend Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── api/                   # API client layer
│   │   └── client.js              # Fetch wrapper with auth
│   │
│   ├── auth/                  # Authentication logic
│   │   └── ProtectedRoute.js      # Route guard component
│   │
│   ├── components/            # Reusable components
│   │   ├── Navbar.js
│   │   └── StatCard.js
│   │
│   ├── pages/                 # Page components
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── Projects.js
│   │   ├── ProjectDetails.js
│   │   └── Users.js
│   │
│   ├── utils/                 # Utility functions
│   │   └── auth.js                # Auth helper functions
│   │
│   ├── styles/                # CSS styles
│   │   └── theme.css
│   │
│   ├── App.js                 # Root component with routing
│   └── index.js               # React entry point
│
├── .env                       # Environment variables
├── .gitignore
├── Dockerfile                 # Frontend Docker image
├── package.json
└── package-lock.json
```

### 1.3 Root Structure

```
multi-tenant-saas/
├── backend/                   # Backend application
├── frontend/                  # Frontend application
├── docs/                      # Documentation
│   ├── research.md
│   ├── PRD.md
│   ├── architecture.md
│   ├── technical-spec.md
│   └── API.md
│
├── docker-compose.yml         # Docker services orchestration
├── submission.json            # Test credentials for evaluation
├── README.md                  # Project documentation
└── .gitignore
```

---

## 2. Development Setup Guide

### 2.1 Prerequisites

**Required Software:**

- **Node.js:** v18 LTS or higher
- **npm:** v9 or higher (comes with Node.js)
- **Docker:** v20 or higher
- **Docker Compose:** v2 or higher
- **Git:** Latest version
- **Code Editor:** VS Code (recommended) or any IDE

**Operating System:**

- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+, Debian, etc.)

**Hardware Recommendations:**

- 4GB RAM minimum (8GB recommended)
- 10GB free disk space
- Multi-core processor

### 2.2 Installation Steps

#### Step 1: Clone Repository

```bash
git clone <repository-url>
cd multi-tenant-saas
```

#### Step 2: Environment Configuration

**Backend Environment Variables:**

Create `backend/.env`:

```env
# Database Configuration
DB_HOST=database
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Frontend Environment Variables:**

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

#### Step 3: Docker Setup (Recommended)

**Start all services:**

```bash
docker-compose up --build
```

**This command will:**

1. Build Docker images for backend and frontend
2. Start PostgreSQL database
3. Run database migrations automatically
4. Load seed data
5. Start backend API server (port 5000)
6. Start frontend dev server (port 3000)

**Wait for all services to be healthy (30-60 seconds)**

**Access the application:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

#### Step 4: Verify Installation

**Check all containers are running:**

```bash
docker ps
```

Expected output:

```
CONTAINER ID   IMAGE           PORTS                    NAMES
xxxxx          frontend        0.0.0.0:3000->3000/tcp   frontend
xxxxx          backend         0.0.0.0:5000->5000/tcp   backend
xxxxx          postgres:15     0.0.0.0:5432->5432/tcp   database
```

**Test backend health:**

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-09T10:30:00.000Z"
}
```

#### Step 5: Test Login

**Default Credentials:**

- **Super Admin:** superadmin@system.com / Admin@123
- **Tenant Admin:** admin@demo.com / Demo@123 (subdomain: demo)
- **User 1:** user1@demo.com / User@123 (subdomain: demo)
- **User 2:** user2@demo.com / User@123 (subdomain: demo)

### 2.3 Local Development (Without Docker)

**If you prefer to run services directly on your machine:**

#### Backend Setup:

```bash
cd backend

# Install dependencies
npm install

# Ensure PostgreSQL is running locally
# Create database: saas_db

# Update backend/.env with local DB credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=your_password

# Run migrations
npm run migrate  # (if you have a migrate script)

# Run seeds
npm run seed     # (if you have a seed script)

# Start backend
npm start        # Runs on port 5000
```

#### Frontend Setup:

```bash
cd frontend

# Install dependencies
npm install

# Update frontend/.env
REACT_APP_API_URL=http://localhost:5000

# Start frontend
npm start        # Runs on port 3000
```

### 2.4 Stopping Services

**Docker:**

```bash
# Stop services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

**Local:**

```bash
# Press Ctrl+C in each terminal running npm start
```

---

## 3. Database Setup

### 3.1 Migration System

Migrations are SQL files in `backend/migrations/` that run in order:

**Migration Files:**

1. `001_create_tenants.sql` - Creates tenants table with ENUM types
2. `002_create_users.sql` - Creates users table with foreign key to tenants
3. `003_create_projects.sql` - Creates projects table
4. `004_create_tasks.sql` - Creates tasks table
5. `005_create_audit_logs.sql` - Creates audit_logs table

**How Migrations Work:**

- Backend startup script (`src/server.js`) calls `runMigrations()`
- `runMigrations()` reads all SQL files from `migrations/` folder
- Executes them in alphabetical order
- Uses `CREATE TABLE IF NOT EXISTS` for idempotency

### 3.2 Seed Data

**Seed Script:** `backend/src/seeds/seed.js`

**Creates:**

- 1 Super Admin user (superadmin@system.com)
- 1 Demo tenant (subdomain: demo)
- 1 Tenant Admin for demo (admin@demo.com)
- 2 Regular users for demo (user1@demo.com, user2@demo.com)
- 2 Sample projects
- 5 Sample tasks

**Seed data runs automatically on backend startup if NODE_ENV !== 'production'**

### 3.3 Manual Database Operations

**Connect to PostgreSQL container:**

```bash
docker exec -it database psql -U postgres -d saas_db
```

**Common queries:**

```sql
-- List all tables
\dt

-- View tenants
SELECT * FROM tenants;

-- View users
SELECT id, email, role, tenant_id FROM users;

-- View projects
SELECT * FROM projects;

-- View tasks
SELECT * FROM tasks;
```

---

## 4. API Testing

### 4.1 Using cURL

**Register Tenant:**

```bash
curl -X POST http://localhost:5000/api/auth/register-tenant \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Test Company",
    "subdomain": "testco",
    "adminEmail": "admin@testco.com",
    "adminPassword": "Test@123",
    "adminFullName": "Test Admin"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "Demo@123",
    "subdomain": "demo"
  }'
```

**Get Current User (with token):**

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Project:**

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "New Project",
    "description": "Project description"
  }'
```

### 4.2 Using Postman

1. Import API endpoints from `docs/API.md`
2. Create environment with variables:
   - `base_url`: http://localhost:5000
   - `token`: (will be set after login)
3. Login to get token
4. Use `{{token}}` in Authorization header for protected routes

---

## 5. Troubleshooting

### 5.1 Common Issues

**Issue: Backend fails to start**

```
Error: relation "tasks" already exists
```

**Solution:**

```bash
docker-compose down -v  # Remove volumes
docker-compose up --build
```

**Issue: Frontend can't connect to backend**

```
CORS error or "Failed to fetch"
```

**Solution:**

- Check `FRONTEND_URL` in backend docker-compose.yml is `http://localhost:3000`
- Check `REACT_APP_API_URL` in frontend docker-compose.yml is `http://localhost:5000`
- Rebuild: `docker-compose down && docker-compose up --build`

**Issue: Database connection refused**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

- Wait for database health check to pass
- Check `DB_HOST=database` in backend environment (not localhost)

**Issue: Port already in use**

```
Error: bind: address already in use
```

**Solution:**

```bash
# Find process using port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Kill process or change port in docker-compose.yml
```

### 5.2 Debug Mode

**Backend logs:**

```bash
docker logs -f backend
```

**Frontend logs:**

```bash
docker logs -f frontend
```

**Database logs:**

```bash
docker logs -f database
```

**All logs:**

```bash
docker-compose logs -f
```

---

## 6. Code Style and Best Practices

### 6.1 Backend Conventions

**Naming:**

- Files: `kebab-case.js` (e.g., `auth.controller.js`)
- Functions: `camelCase` (e.g., `getUserById`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`)

**Response Format:**

```javascript
// Success
{
  success: true,
  data: { ... },
  message: "Optional message"
}

// Error
{
  success: false,
  message: "Error description"
}
```

**HTTP Status Codes:**

- 200: Success (GET, PUT, DELETE)
- 201: Created (POST)
- 400: Bad Request (validation errors)
- 401: Unauthorized (no token or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 500: Internal Server Error

### 6.2 Frontend Conventions

**Naming:**

- Components: `PascalCase.js` (e.g., `Login.js`)
- Functions: `camelCase` (e.g., `handleSubmit`)
- CSS classes: `kebab-case` (e.g., `login-form`)

**Component Structure:**

```javascript
// Imports
import React from "react";

// Component
function MyComponent() {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handleClick = () => {};

  // Render
  return <div>...</div>;
}

export default MyComponent;
```

---

## 7. Deployment

### 7.1 Docker Deployment

**Production Build:**

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

**Environment Variables:**

- Change `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Update `FRONTEND_URL` to production domain
- Use managed PostgreSQL (AWS RDS, DigitalOcean, etc.)

### 7.2 Cloud Deployment Options

**Backend + Database:**

- AWS: ECS + RDS
- DigitalOcean: App Platform + Managed PostgreSQL
- Heroku: Container Registry + PostgreSQL addon
- Railway: Docker deployment

**Frontend:**

- Vercel (static export)
- Netlify (static export)
- AWS S3 + CloudFront
- DigitalOcean App Platform

---

## 8. Testing

### 8.1 Manual Testing Checklist

**Authentication:**

- [ ] Register new tenant
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected route without token
- [ ] Token expiry after 24 hours

**Tenant Management:**

- [ ] Super admin can list all tenants
- [ ] Tenant admin can view own tenant
- [ ] Regular user cannot access tenant APIs

**User Management:**

- [ ] Tenant admin can add users
- [ ] Subscription limit enforced
- [ ] Cannot delete self
- [ ] Email unique per tenant

**Projects:**

- [ ] Create project
- [ ] Project limit enforced
- [ ] Update project
- [ ] Delete project (cascades to tasks)

**Tasks:**

- [ ] Create task
- [ ] Assign to user in same tenant
- [ ] Cannot assign to user in different tenant
- [ ] Update task status
- [ ] Filter tasks by status/priority

### 8.2 Future Test Automation

- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Cypress or Playwright
- API tests with Postman/Newman

---

## Conclusion

This technical specification provides complete setup instructions, project structure, and development guidelines for the multi-tenant SaaS platform. Follow the Docker setup for the fastest and most reliable development experience, and refer to the troubleshooting section for common issues.

For API details, see `docs/API.md`.  
For architecture overview, see `docs/architecture.md`.
