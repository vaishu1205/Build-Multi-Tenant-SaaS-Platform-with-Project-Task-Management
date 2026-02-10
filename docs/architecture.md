# System Architecture Document

## Multi-Tenant SaaS Platform - Project & Task Management

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

The system follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Frontend (Port 3000)                    │   │
│  │  - Login/Register Pages                               │   │
│  │  - Dashboard                                          │   │
│  │  - Projects & Tasks Management                        │   │
│  │  - User Management                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTPS (REST API)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Node.js/Express Backend (Port 5000)             │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Authentication Middleware (JWT)              │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Authorization Middleware (RBAC)              │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  API Routes & Controllers                     │   │   │
│  │  │  - Auth, Tenants, Users, Projects, Tasks     │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Business Logic & Services                    │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                   TCP Connection (Port 5432)
                            │
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         PostgreSQL 15 (Port 5432)                    │   │
│  │                                                       │   │
│  │  Tables: tenants, users, projects, tasks,            │   │
│  │          audit_logs                                  │   │
│  │                                                       │   │
│  │  Features: ACID transactions, Row-level security,    │   │
│  │           Indexes on tenant_id                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Characteristics

- **Multi-Tier:** Separation of presentation, business logic, and data layers
- **RESTful API:** Stateless HTTP communication between frontend and backend
- **Containerized:** All services run in Docker containers for consistency
- **Stateless:** JWT-based authentication enables horizontal scaling
- **Multi-Tenant:** Single database with tenant_id isolation

---

## 2. Database Schema Design

### 2.1 Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                         TENANTS                                  │
├─────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                   │
│     name (VARCHAR)                                              │
│ UK  subdomain (VARCHAR)                                         │
│     status (ENUM: active, suspended, trial)                     │
│     subscription_plan (ENUM: free, pro, enterprise)             │
│     max_users (INTEGER) DEFAULT 5                               │
│     max_projects (INTEGER) DEFAULT 3                            │
│     created_at (TIMESTAMP)                                      │
│     updated_at (TIMESTAMP)                                      │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ 1
                            │
                            │ N
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                   │
├─────────────────────────────────────────────────────────────────┤
│ PK  id (UUID)                                                   │
│ FK  tenant_id (UUID) REFERENCES tenants(id) CASCADE             │
│     email (VARCHAR)                                             │
│     password_hash (VARCHAR)                                     │
│     full_name (VARCHAR)                                         │
│     role (ENUM: super_admin, tenant_admin, user)               │
│     is_active (BOOLEAN) DEFAULT true                            │
│     created_at (TIMESTAMP)                                      │
│     updated_at (TIMESTAMP)                                      │
│ UK  (tenant_id, email)                                          │
│ IDX tenant_id                                                   │
└─────────────────────────────────────────────────────────────────┘
        │                       │
        │ 1                     │ 1
        │                       │
        │ N                     │ N
        ▼                       ▼
┌─────────────────────┐  ┌─────────────────────────────────────────┐
│    AUDIT_LOGS       │  │           PROJECTS                       │
├─────────────────────┤  ├─────────────────────────────────────────┤
│ PK  id (UUID)       │  │ PK  id (UUID)                           │
│ FK  tenant_id       │  │ FK  tenant_id REFERENCES tenants CASCADE│
│ FK  user_id         │  │     name (VARCHAR)                      │
│     action          │  │     description (TEXT)                  │
│     entity_type     │  │     status (ENUM: active, archived, ... │
│     entity_id       │  │ FK  created_by REFERENCES users(id)    │
│     ip_address      │  │     created_at (TIMESTAMP)              │
│     created_at      │  │     updated_at (TIMESTAMP)              │
└─────────────────────┘  │ IDX tenant_id                           │
                         └─────────────────────────────────────────┘
                                        │
                                        │ 1
                                        │
                                        │ N
                                        ▼
                         ┌─────────────────────────────────────────┐
                         │              TASKS                       │
                         ├─────────────────────────────────────────┤
                         │ PK  id (UUID)                           │
                         │ FK  project_id REFERENCES projects      │
                         │ FK  tenant_id REFERENCES tenants        │
                         │     title (VARCHAR)                     │
                         │     description (TEXT)                  │
                         │     status (ENUM: todo, in_progress,... │
                         │     priority (ENUM: low, medium, high)  │
                         │ FK  assigned_to REFERENCES users(id)    │
                         │     due_date (DATE)                     │
                         │     created_at (TIMESTAMP)              │
                         │     updated_at (TIMESTAMP)              │
                         │ IDX (tenant_id, project_id)             │
                         └─────────────────────────────────────────┘
```

### 2.2 Key Design Decisions

**Tenant Isolation:**

- Every table (except super_admin users) has `tenant_id` foreign key
- All queries filter by `tenant_id` automatically
- Indexes on `tenant_id` columns for query performance

**Cascade Deletes:**

- Delete tenant → deletes all users, projects, tasks, audit_logs
- Delete user → sets `assigned_to = NULL` in tasks
- Delete project → deletes all related tasks

**Email Uniqueness:**

- Composite unique constraint: `(tenant_id, email)`
- Same email can exist in different tenants
- Prevents duplicate emails within same tenant

**Super Admin:**

- `tenant_id = NULL` for super_admin users
- Can access all tenants
- Not bound to any specific organization

---

## 3. API Architecture

### 3.1 API Endpoint List

#### **Authentication APIs**

| Method | Endpoint                    | Auth Required | Role Required | Description                           |
| ------ | --------------------------- | ------------- | ------------- | ------------------------------------- |
| POST   | `/api/auth/register-tenant` | ❌            | -             | Register new tenant with admin        |
| POST   | `/api/auth/login`           | ❌            | -             | Login with email, password, subdomain |
| GET    | `/api/auth/me`              | ✅            | Any           | Get current user info                 |
| POST   | `/api/auth/logout`          | ✅            | Any           | Logout (client-side token removal)    |

#### **Tenant Management APIs**

| Method | Endpoint                 | Auth Required | Role Required               | Description                       |
| ------ | ------------------------ | ------------- | --------------------------- | --------------------------------- |
| GET    | `/api/tenants`           | ✅            | super_admin                 | List all tenants (paginated)      |
| GET    | `/api/tenants/:tenantId` | ✅            | super_admin OR owner        | Get tenant details with stats     |
| PUT    | `/api/tenants/:tenantId` | ✅            | tenant_admin OR super_admin | Update tenant (restricted fields) |

#### **User Management APIs**

| Method | Endpoint                       | Auth Required | Role Required        | Description        |
| ------ | ------------------------------ | ------------- | -------------------- | ------------------ |
| POST   | `/api/tenants/:tenantId/users` | ✅            | tenant_admin         | Add user to tenant |
| GET    | `/api/tenants/:tenantId/users` | ✅            | Any (same tenant)    | List tenant users  |
| PUT    | `/api/users/:userId`           | ✅            | tenant_admin OR self | Update user        |
| DELETE | `/api/users/:userId`           | ✅            | tenant_admin         | Delete user        |

#### **Project Management APIs**

| Method | Endpoint                   | Auth Required | Role Required           | Description          |
| ------ | -------------------------- | ------------- | ----------------------- | -------------------- |
| POST   | `/api/projects`            | ✅            | Any                     | Create project       |
| GET    | `/api/projects`            | ✅            | Any                     | List tenant projects |
| PUT    | `/api/projects/:projectId` | ✅            | tenant_admin OR creator | Update project       |
| DELETE | `/api/projects/:projectId` | ✅            | tenant_admin OR creator | Delete project       |

#### **Task Management APIs**

| Method | Endpoint                         | Auth Required | Role Required | Description              |
| ------ | -------------------------------- | ------------- | ------------- | ------------------------ |
| POST   | `/api/projects/:projectId/tasks` | ✅            | Any           | Create task in project   |
| GET    | `/api/projects/:projectId/tasks` | ✅            | Any           | List project tasks       |
| PATCH  | `/api/tasks/:taskId/status`      | ✅            | Any           | Update task status only  |
| PUT    | `/api/tasks/:taskId`             | ✅            | Any           | Update task (all fields) |
| DELETE | `/api/tasks/:taskId`             | ✅            | Any           | Delete task              |

#### **System APIs**

| Method | Endpoint      | Auth Required | Role Required | Description                    |
| ------ | ------------- | ------------- | ------------- | ------------------------------ |
| GET    | `/api/health` | ❌            | -             | Health check (database status) |

**Total: 19 API Endpoints**

### 3.2 Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Backend │
└──────────┘                                    └──────────┘
      │                                                │
      │  POST /api/auth/login                         │
      │  { email, password, subdomain }               │
      │───────────────────────────────────────────────▶
      │                                                │
      │                        1. Verify tenant exists│
      │                        2. Find user in tenant │
      │                        3. Verify password     │
      │                        4. Generate JWT token  │
      │                           { userId, tenantId, │
      │                             role, exp }       │
      │                                                │
      │  200 OK                                        │
      │  { success: true, data: { user, token } }     │
      │◀───────────────────────────────────────────────
      │                                                │
      │  Store token in localStorage                  │
      │                                                │
      │  GET /api/projects                            │
      │  Authorization: Bearer <token>                │
      │───────────────────────────────────────────────▶
      │                                                │
      │                        1. Extract JWT token   │
      │                        2. Verify signature    │
      │                        3. Decode payload      │
      │                        4. Filter by tenantId  │
      │                                                │
      │  200 OK                                        │
      │  { success: true, data: { projects: [...] } } │
      │◀───────────────────────────────────────────────
      │                                                │
```

### 3.3 Authorization Levels

**Level 1: Public (No Auth Required)**

- Tenant registration
- User login
- Health check

**Level 2: Authenticated (Any Logged-in User)**

- Get current user
- Create projects/tasks
- List own tenant's data
- Update task status

**Level 3: Tenant Admin**

- Add/remove users
- Update user roles
- Delete projects/tasks created by others
- Update tenant name

**Level 4: Super Admin**

- List all tenants
- Update tenant subscription/status
- Access any tenant's data
- System-wide operations

---

## 4. Security Architecture

### 4.1 Multi-Tenant Isolation Strategy

```javascript
// Every query automatically filters by tenant_id from JWT

// ✓ CORRECT - tenantId from authenticated user
router.get("/projects", auth, async (req, res) => {
  const projects = await db.query(
    "SELECT * FROM projects WHERE tenant_id = $1",
    [req.user.tenantId], // From JWT token
  );
  res.json({ success: true, data: { projects } });
});

// ✗ WRONG - trusting client input
router.get("/projects", auth, async (req, res) => {
  const projects = await db.query(
    "SELECT * FROM projects WHERE tenant_id = $1",
    [req.body.tenantId], // Attacker can manipulate!
  );
});
```

### 4.2 Authentication Middleware

```javascript
// JWT verification middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, tenantId, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

### 4.3 Authorization Middleware

```javascript
// Role-based access control
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// Usage
router.get("/tenants", auth, authorize("super_admin"), listTenants);
```

---

## 5. Technology Stack

### 5.1 Backend Stack

- **Runtime:** Node.js v18 LTS
- **Framework:** Express.js v5
- **Database Driver:** pg (node-postgres)
- **Authentication:** jsonwebtoken, bcrypt
- **Validation:** express-validator
- **Environment:** dotenv

### 5.2 Frontend Stack

- **Framework:** React v18
- **Build Tool:** Create React App
- **HTTP Client:** fetch API
- **Routing:** react-router-dom
- **State Management:** React Context (localStorage for auth)

### 5.3 Database

- **RDBMS:** PostgreSQL v15
- **Features Used:**
  - ENUM types for status fields
  - UUID primary keys
  - Foreign key constraints with CASCADE
  - Indexes on tenant_id columns
  - Composite unique constraints

### 5.4 DevOps

- **Containerization:** Docker + Docker Compose
- **Services:**
  - Database (postgres:15)
  - Backend (Node.js custom image)
  - Frontend (Node.js custom image)

---

## 6. Deployment Architecture

### 6.1 Docker Compose Setup

```yaml
services:
  database:
    - PostgreSQL container
    - Port 5432
    - Volume for data persistence
    - Health check with pg_isready

  backend:
    - Node.js container
    - Port 5000
    - Depends on database health check
    - Runs migrations and seeds on startup
    - Health check on /api/health

  frontend:
    - React dev server container
    - Port 3000
    - Depends on backend health check
    - Environment: REACT_APP_API_URL
```

### 6.2 Service Communication

**Within Docker Network:**

- Backend → Database: `database:5432`
- Backend CORS: Allows `http://localhost:3000`

**From Browser:**

- Frontend → Backend: `http://localhost:5000` (NOT docker service name)
- Browser can't resolve Docker service names

---

## 7. Data Flow Examples

### 7.1 Create Project Flow

```
User → Frontend → Backend → Database

1. User fills project form (name, description)
2. Frontend: POST /api/projects
3. Backend auth middleware: Verify JWT, extract tenantId
4. Backend controller:
   - Check project count vs. max_projects limit
   - If OK: INSERT INTO projects with tenantId from JWT
   - If limit reached: Return 403
5. Database: Insert record, return new project
6. Backend: Return 201 with project data
7. Frontend: Show success message, redirect to projects list
```

### 7.2 Login Flow

```
1. User enters email, password, subdomain
2. Frontend: POST /api/auth/login
3. Backend:
   - Find tenant by subdomain
   - Find user by email + tenant_id
   - Verify password with bcrypt.compare
   - Generate JWT with { userId, tenantId, role }
   - Return token + user data
4. Frontend:
   - Store token in localStorage
   - Redirect to dashboard
5. All subsequent requests include:
   Authorization: Bearer <token>
```

---

## 8. Scalability Considerations

### 8.1 Horizontal Scaling

- **Stateless backend:** Any server can handle any request
- **JWT authentication:** No session storage required
- **Load balancer:** Distribute traffic across multiple backend instances

### 8.2 Database Optimization

- **Indexes:** tenant_id indexed in all tables
- **Connection pooling:** pg-pool manages connections
- **Pagination:** All list endpoints support limit/offset

### 8.3 Future Enhancements

- Redis caching for frequently accessed data
- Read replicas for read-heavy workloads
- CDN for static frontend assets
- Message queue for async operations

---

## Conclusion

This architecture provides a solid foundation for a scalable, secure, multi-tenant SaaS platform. The stateless design enables horizontal scaling, while the shared database approach optimizes costs. Role-based access control and tenant isolation ensure data security, and Docker containerization ensures consistent deployments across all environments.
