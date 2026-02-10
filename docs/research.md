# Multi-Tenant SaaS Platform - Research Document

## 1. Multi-Tenancy Architecture Analysis

### Overview

Multi-tenancy is an architecture where a single instance of software serves multiple customers (tenants). Each tenant's data is isolated and remains invisible to other tenants. This research analyzes three main approaches to implementing multi-tenancy.

### 1.1 Shared Database + Shared Schema (Chosen Approach)

**Description:**
All tenants share the same database and same tables. Data isolation is achieved through a `tenant_id` column in every table. Every query filters by `tenant_id` to ensure data separation.

**Implementation:**

- Single PostgreSQL database for all tenants
- All tables include `tenant_id` foreign key column
- Application-level filtering ensures tenant isolation
- Super admin users have `tenant_id = NULL`

**Pros:**

- **Cost-effective**: Single database infrastructure reduces hosting costs
- **Easy maintenance**: Schema updates apply to all tenants simultaneously
- **Simplified backups**: Single backup strategy for entire system
- **Resource efficiency**: Optimal resource utilization across all tenants
- **Quick tenant onboarding**: New tenants don't require database provisioning
- **Cross-tenant analytics**: Easier for super admin reporting (when authorized)

**Cons:**

- **Security risk**: Application bugs could expose tenant data
- **Performance**: Large tables may require careful indexing on tenant_id
- **Compliance challenges**: Some industries require physical data separation
- **Noisy neighbor**: One tenant's heavy queries can affect others
- **Schema changes**: Downtime affects all tenants

**Security Measures:**

- Mandatory `tenant_id` filtering in all queries
- Row-level security policies in PostgreSQL
- Authentication middleware validates tenant ownership
- Audit logging for all data access
- Index optimization on tenant_id columns

### 1.2 Shared Database + Separate Schema

**Description:**
All tenants share one database, but each tenant gets their own schema (namespace). For example: `tenant_abc.users`, `tenant_xyz.users`.

**Pros:**

- Better isolation than shared schema
- Easier to backup individual tenants
- Can customize schema per tenant if needed
- Database-level security policies possible

**Cons:**

- **Schema management complexity**: Creating/migrating N schemas for N tenants
- **Connection pooling issues**: Need separate connections per schema
- **Backup complexity**: Must backup each schema separately
- **Limited scalability**: PostgreSQL schema limits (~10,000 realistically)
- **Query complexity**: Dynamic schema names in application code

**Why Not Chosen:**
While providing better isolation, this approach adds significant operational complexity. For a SaaS boilerplate targeting 100-1000 tenants, the maintenance overhead outweighs security benefits. Modern application-level security can adequately protect shared schema implementations.

### 1.3 Separate Database Per Tenant

**Description:**
Each tenant gets their own dedicated database instance. Complete physical separation of all tenant data.

**Pros:**

- **Maximum isolation**: Physical separation eliminates cross-tenant risks
- **Performance**: No noisy neighbor issues
- **Compliance**: Meets strict regulatory requirements
- **Customization**: Can customize database per tenant
- **Backup/restore**: Isolated backup/restore per tenant

**Cons:**

- **High cost**: N databases for N tenants significantly increases infrastructure costs
- **Maintenance nightmare**: Schema migrations must run on every database
- **Resource waste**: Small tenants waste entire database resources
- **Connection limits**: Each database requires separate connections
- **Operational complexity**: Monitoring, backups, updates multiply by tenant count
- **Onboarding delay**: Provisioning new database takes time

**Why Not Chosen:**
This approach is only justified for enterprise customers or highly regulated industries (healthcare, finance). For a general-purpose SaaS platform, the operational costs and complexity far exceed the benefits. Reserved for "enterprise" tier customers who require dedicated infrastructure.

### Comparison Table

| Aspect               | Shared Schema ✓      | Separate Schema   | Separate Database  |
| -------------------- | -------------------- | ----------------- | ------------------ |
| **Cost**             | Low                  | Medium            | High               |
| **Isolation**        | Application-level    | Schema-level      | Physical           |
| **Maintenance**      | Simple               | Complex           | Very Complex       |
| **Scalability**      | Excellent (millions) | Good (thousands)  | Limited (hundreds) |
| **Onboarding Speed** | Instant              | Seconds           | Minutes            |
| **Backup Strategy**  | Single backup        | N backups         | N backups          |
| **Performance**      | Good (with indexes)  | Good              | Excellent          |
| **Compliance**       | Basic                | Medium            | High               |
| **Recommended For**  | 90% of SaaS apps     | Specialized needs | Enterprise only    |

### Our Choice: Shared Database + Shared Schema

**Justification:**
For a multi-tenant project management SaaS targeting small to medium businesses, the shared schema approach provides the optimal balance of:

1. **Simplicity**: Single codebase, single database, straightforward maintenance
2. **Cost**: Minimize infrastructure costs for early-stage product
3. **Scalability**: Can serve thousands of tenants without architectural changes
4. **Speed**: Instant tenant provisioning enables self-service signup

**Risk Mitigation:**

- Comprehensive test coverage for tenant isolation
- Automated security audits checking for missing tenant_id filters
- PostgreSQL row-level security as backup defense layer
- Extensive audit logging for compliance and debugging

---

## 2. Technology Stack Justification

### 2.1 Backend: Node.js + Express

**Chosen:** Node.js v18 LTS with Express.js v5

**Reasoning:**

- **JavaScript everywhere**: Shared language between frontend and backend reduces context switching
- **NPM ecosystem**: Largest package registry provides solutions for every need
- **Performance**: Event-driven architecture handles concurrent connections efficiently
- **Real-time capable**: Native WebSocket support for future real-time features
- **Hiring**: Large talent pool of JavaScript developers
- **Community**: Extensive documentation, tutorials, and Stack Overflow support

**Alternatives Considered:**

- **Python (Django/Flask)**: Excellent choice but slower startup time, heavier runtime
- **Go**: Superior performance but smaller ecosystem, steeper learning curve
- **Java (Spring Boot)**: Enterprise-ready but verbose, heavyweight for SaaS boilerplate

**Why Not Python/Go/Java:**
While technically superior in some aspects, Node.js offers the best developer experience for rapid SaaS development. The ability to share validation logic, types, and utilities between frontend and backend is invaluable.

### 2.2 Frontend: React.js

**Chosen:** React v18 with Create React App

**Reasoning:**

- **Industry standard**: Most popular frontend framework, maximum hiring pool
- **Component reusability**: Build once, reuse across application
- **Virtual DOM**: Efficient rendering for complex UIs
- **Ecosystem**: Massive library ecosystem (routing, state, forms, etc.)
- **Developer tools**: Excellent debugging and profiling tools
- **Learning resources**: Unlimited tutorials, courses, documentation

**Alternatives Considered:**

- **Vue.js**: Easier learning curve but smaller ecosystem
- **Angular**: Full-featured but opinionated and heavyweight
- **Svelte**: Innovative but smaller community, fewer libraries

**Why React:**
For a SaaS boilerplate targeting developers, React's ubiquity is key. Most developers know React, making the boilerplate immediately accessible. The ecosystem maturity ensures solutions exist for every problem.

### 2.3 Database: PostgreSQL

**Chosen:** PostgreSQL v15

**Reasoning:**

- **ACID compliance**: Reliable transactions essential for SaaS applications
- **JSON support**: Native JSONB type for flexible schema extensions
- **Full-text search**: Built-in search capabilities without external dependencies
- **Extensions**: PostGIS, pg_cron, and others enable advanced features
- **Row-level security**: Native multi-tenancy security support
- **Performance**: Excellent query optimizer, efficient indexing
- **Open source**: No licensing costs, community-driven development

**Alternatives Considered:**

- **MySQL**: Popular but weaker JSON support, fewer advanced features
- **MongoDB**: Great for flexibility but ACID guarantees only in v4+, less suitable for transactional SaaS
- **SQLite**: Too simple for multi-tenant production systems

**Why PostgreSQL:**
For multi-tenant SaaS, PostgreSQL's combination of reliability, features, and performance is unmatched. Row-level security provides an additional safety layer for tenant isolation. JSONB enables schema flexibility without sacrificing transaction safety.

### 2.4 Authentication: JWT (JSON Web Tokens)

**Chosen:** JWT with bcrypt password hashing

**Reasoning:**

- **Stateless**: No server-side session storage required, enables horizontal scaling
- **Self-contained**: Token contains all user information (userId, tenantId, role)
- **Cross-domain**: Works seamlessly across multiple frontend deployments
- **Mobile-friendly**: Easy to implement in mobile applications
- **Industry standard**: Well-understood security model

**Alternatives Considered:**

- **Session-based**: Requires Redis/database, limits scalability
- **OAuth 2.0**: Overkill for internal authentication, adds complexity
- **Passport.js**: Good abstraction but unnecessary for simple JWT implementation

**Security Measures:**

- **bcrypt hashing**: Password hashing with salt rounds = 10
- **Token expiry**: 24-hour expiration forces regular re-authentication
- **HTTPS only**: Tokens transmitted only over encrypted connections
- **httpOnly cookies** (optional): Can upgrade to cookie-based storage for XSS protection

### 2.5 Containerization: Docker + Docker Compose

**Chosen:** Docker with Docker Compose orchestration

**Reasoning:**

- **Environment consistency**: "Works on my machine" eliminated
- **Dependency isolation**: All services containerized with exact versions
- **Easy onboarding**: New developers run `docker-compose up` and start coding
- **Production parity**: Development environment matches production exactly
- **Microservices ready**: Easy to split into microservices later
- **CI/CD integration**: Containerized apps deploy seamlessly to any cloud

**Why Docker:**
For a SaaS boilerplate, Docker ensures every developer and every deployment runs identical code in identical environments. This eliminates 90% of configuration-related bugs.

### Technology Stack Summary

| Component              | Technology     | Version | Justification                          |
| ---------------------- | -------------- | ------- | -------------------------------------- |
| **Backend Runtime**    | Node.js        | v18 LTS | JavaScript everywhere, large ecosystem |
| **Backend Framework**  | Express.js     | v5      | Minimal, flexible, well-documented     |
| **Frontend Framework** | React          | v18     | Industry standard, huge ecosystem      |
| **Database**           | PostgreSQL     | v15     | ACID compliance, advanced features     |
| **Authentication**     | JWT + bcrypt   | -       | Stateless, scalable authentication     |
| **Containerization**   | Docker Compose | v3.8    | Environment consistency                |
| **API Style**          | RESTful        | -       | Simple, stateless, cacheable           |

---

## 3. Security Considerations

### 3.1 Multi-Tenant Data Isolation

**Challenge:** Preventing tenant A from accessing tenant B's data.

**Solution:**

1. **Application-level filtering**: Every database query includes `WHERE tenant_id = ?`
2. **Middleware enforcement**: Authentication middleware extracts tenantId from JWT, all subsequent queries use this value
3. **No client-provided tenant_id**: Never trust tenant_id from request body/params
4. **Super admin exception**: Users with role='super_admin' have tenant_id=NULL and can access all tenants

**Code Pattern:**

```javascript
// ✓ CORRECT - tenantId from JWT token
const projects = await db.query(
  "SELECT * FROM projects WHERE tenant_id = $1",
  [req.user.tenantId], // From JWT, not request body
);

// ✗ WRONG - tenantId from request (can be manipulated!)
const projects = await db.query(
  "SELECT * FROM projects WHERE tenant_id = $1",
  [req.body.tenantId], // Attacker can change this!
);
```

### 3.2 Authentication Security

**Password Security:**

- **Hashing**: bcrypt with 10 salt rounds (industry standard)
- **Never store plaintext**: Passwords never stored in readable form
- **Compare with bcrypt**: Use `bcrypt.compare()` to verify, never string comparison

**JWT Security:**

- **Secret key**: Strong secret key (min 32 characters) stored in environment variables
- **Token expiry**: 24-hour expiration forces regular re-authentication
- **Payload minimal**: Only userId, tenantId, role - no sensitive data
- **HTTPS requirement**: Tokens transmitted over encrypted connections only

**Login Attempt Protection:**

- Rate limiting on login endpoint (future enhancement)
- Account lockout after N failed attempts (future enhancement)
- Email notification on suspicious login (future enhancement)

### 3.3 Authorization (Role-Based Access Control)

**Three Roles:**

1. **super_admin**: System administrator, access to all tenants
2. **tenant_admin**: Organization admin, full control within their tenant
3. **user**: Regular user, limited permissions within their tenant

**Authorization Middleware:**

```javascript
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// Usage: Only tenant_admin can create users
router.post("/users", auth, authorize("tenant_admin"), createUser);
```

### 3.4 API Security

**Input Validation:**

- **express-validator**: Validate all request inputs (email format, password strength, required fields)
- **Sanitization**: Remove potentially dangerous characters from inputs
- **Type checking**: Ensure data types match expectations

**SQL Injection Prevention:**

- **Parameterized queries**: Always use `$1, $2` placeholders, never string concatenation
- **ORM/Query builder**: pg library automatically escapes parameters

**XSS Protection:**

- **Content-Type headers**: Explicitly set Content-Type: application/json
- **Escape output**: React automatically escapes JSX content
- **CSP headers**: Content Security Policy headers (future enhancement)

**CORS Configuration:**

- **Whitelist origins**: Only allow requests from known frontend domains
- **Credentials**: Enable credentials: true for cookie-based authentication
- **Preflight caching**: Set max age for OPTIONS requests

### 3.5 Audit Logging

**Purpose:** Track all important actions for security audits and debugging.

**What to Log:**

- User creation, updates, deletion
- Project and task creation/deletion
- Tenant subscription changes
- Login attempts (success and failure)
- Authorization failures

**Audit Log Schema:**

```sql
audit_logs (
  id, tenant_id, user_id, action,
  entity_type, entity_id,
  ip_address, created_at
)
```

**Example:**

```javascript
await auditLog.create({
  tenantId: req.user.tenantId,
  userId: req.user.userId,
  action: "DELETE_PROJECT",
  entityType: "project",
  entityId: projectId,
  ipAddress: req.ip,
});
```

### Security Checklist Summary

- ✅ Tenant isolation enforced at application level
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiry
- ✅ Role-based access control
- ✅ Parameterized SQL queries
- ✅ Input validation on all endpoints
- ✅ CORS configured for frontend domain
- ✅ Audit logging for important actions
- ✅ HTTPS in production (deployment requirement)
- ✅ Environment variables for secrets

---

## 4. Scalability Considerations

### 4.1 Database Scalability

**Indexing Strategy:**

- Index on `tenant_id` in all multi-tenant tables
- Composite indexes on frequently queried columns: `(tenant_id, created_at)`, `(tenant_id, status)`
- Full-text search indexes on searchable text columns

**Query Optimization:**

- Use `EXPLAIN ANALYZE` to identify slow queries
- Paginate large result sets (default: 50 items per page)
- Avoid N+1 queries with proper JOINs

**Connection Pooling:**

- pg-pool maintains connection pool (default: 10 connections)
- Reuses connections across requests
- Prevents connection exhaustion

**Future Enhancements:**

- Read replicas for read-heavy workloads
- Partitioning large tables by tenant_id
- Redis caching for frequently accessed data

### 4.2 Application Scalability

**Stateless Design:**

- JWT authentication eliminates server-side sessions
- Any API server can handle any request
- Enables horizontal scaling behind load balancer

**Horizontal Scaling:**

- Deploy multiple backend instances
- Load balancer (nginx/ALB) distributes traffic
- No shared state between instances

**Caching Strategy (Future):**

- Redis for session caching (if needed)
- CDN for static assets (frontend)
- API response caching for read-heavy endpoints

### 4.3 Tenant Limits

**Subscription Plans:**

- **Free**: 5 users, 3 projects
- **Pro**: 25 users, 15 projects
- **Enterprise**: 100 users, 50 projects

**Enforcement:**

- Check current count before creating new resources
- Return 403 Forbidden if limit reached
- Upgrade prompt in UI when approaching limits

**Future Monetization:**

- Stripe integration for payment processing
- Usage-based billing (API calls, storage)
- Overage charges for exceeding limits

---

## Conclusion

This multi-tenant SaaS platform uses a **shared database + shared schema** architecture with **Node.js/Express backend**, **React frontend**, and **PostgreSQL database**. The chosen technologies provide the optimal balance of simplicity, cost-effectiveness, and scalability for a general-purpose SaaS boilerplate.

**Key Design Decisions:**

1. Shared schema for cost efficiency and scalability
2. JWT authentication for stateless scalability
3. Role-based access control for flexible permissions
4. PostgreSQL for reliability and advanced features
5. Docker for environment consistency

This architecture supports thousands of tenants with proper indexing and can scale horizontally by adding more backend instances. For enterprise customers requiring dedicated resources, the system can be extended to support separate databases per tenant.
