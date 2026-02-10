# API Documentation

## Multi-Tenant SaaS Platform - REST API Reference

**Base URL:** `http://localhost:5000/api`  
**Authentication:** JWT Bearer Token  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [Tenant Management APIs](#2-tenant-management-apis)
3. [User Management APIs](#3-user-management-apis)
4. [Project Management APIs](#4-project-management-apis)
5. [Task Management APIs](#5-task-management-apis)
6. [System APIs](#6-system-apis)

---

## 1. Authentication APIs

### 1.1 Register Tenant

**Endpoint:** `POST /api/auth/register-tenant`  
**Authentication:** None (Public)  
**Description:** Register a new tenant organization with admin user

**Request Body:**

```json
{
  "tenantName": "Demo Company",
  "subdomain": "demo",
  "adminEmail": "admin@demo.com",
  "adminPassword": "Demo@123",
  "adminFullName": "Demo Admin"
}
```

**Validation Rules:**

- `tenantName`: Required, 3-100 characters
- `subdomain`: Required, unique, alphanumeric, 3-63 characters
- `adminEmail`: Required, valid email format
- `adminPassword`: Required, min 8 characters
- `adminFullName`: Required, 2-100 characters

**Success Response (201):**

```json
{
  "success": true,
  "message": "Tenant registered successfully",
  "data": {
    "tenantId": "11111111-1111-1111-1111-111111111111",
    "subdomain": "demo",
    "adminUser": {
      "id": "22222222-2222-2222-2222-222222222222",
      "email": "admin@demo.com",
      "fullName": "Demo Admin",
      "role": "tenant_admin"
    }
  }
}
```

**Error Responses:**

- `400 Bad Request`: Validation errors
- `409 Conflict`: Subdomain or email already exists

**Example cURL:**

```bash
curl -X POST http://localhost:5000/api/auth/register-tenant \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Demo Company",
    "subdomain": "demo",
    "adminEmail": "admin@demo.com",
    "adminPassword": "Demo@123",
    "adminFullName": "Demo Admin"
  }'
```

---

### 1.2 Login

**Endpoint:** `POST /api/auth/login`  
**Authentication:** None (Public)  
**Description:** Login with email, password, and tenant subdomain

**Request Body:**

```json
{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "subdomain": "demo"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "22222222-2222-2222-2222-222222222222",
      "email": "admin@demo.com",
      "fullName": "Demo Admin",
      "role": "tenant_admin",
      "tenantId": "11111111-1111-1111-1111-111111111111"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid credentials
- `404 Not Found`: Tenant not found
- `403 Forbidden`: Account suspended/inactive

**Example cURL:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "Demo@123",
    "subdomain": "demo"
  }'
```

---

### 1.3 Get Current User

**Endpoint:** `GET /api/auth/me`  
**Authentication:** Required  
**Description:** Get authenticated user information

**Request Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "22222222-2222-2222-2222-222222222222",
    "email": "admin@demo.com",
    "fullName": "Demo Admin",
    "role": "tenant_admin",
    "isActive": true,
    "tenant": {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Demo Company",
      "subdomain": "demo",
      "subscriptionPlan": "pro",
      "maxUsers": 25,
      "maxProjects": 15
    }
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or expired token
- `404 Not Found`: User not found

---

### 1.4 Logout

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required  
**Description:** Logout user (client removes token)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Tenant Management APIs

### 2.1 List All Tenants

**Endpoint:** `GET /api/tenants`  
**Authentication:** Required  
**Authorization:** super_admin only  
**Description:** List all tenants in the system (paginated)

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `status`: Filter by status (active, suspended, trial)
- `subscriptionPlan`: Filter by plan (free, pro, enterprise)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "11111111-1111-1111-1111-111111111111",
        "name": "Demo Company",
        "subdomain": "demo",
        "status": "active",
        "subscriptionPlan": "pro",
        "totalUsers": 5,
        "totalProjects": 3,
        "createdAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTenants": 47,
      "limit": 10
    }
  }
}
```

**Error Responses:**

- `403 Forbidden`: Not super_admin

---

### 2.2 Get Tenant Details

**Endpoint:** `GET /api/tenants/:tenantId`  
**Authentication:** Required  
**Authorization:** super_admin OR user belongs to tenant  
**Description:** Get tenant details with usage statistics

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Demo Company",
    "subdomain": "demo",
    "status": "active",
    "subscriptionPlan": "pro",
    "maxUsers": 25,
    "maxProjects": 15,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "stats": {
      "totalUsers": 5,
      "totalProjects": 3,
      "totalTasks": 15
    }
  }
}
```

**Error Responses:**

- `403 Forbidden`: User doesn't belong to tenant
- `404 Not Found`: Tenant not found

---

### 2.3 Update Tenant

**Endpoint:** `PUT /api/tenants/:tenantId`  
**Authentication:** Required  
**Authorization:** tenant_admin (limited fields) OR super_admin (all fields)  
**Description:** Update tenant information

**Request Body (tenant_admin):**

```json
{
  "name": "Updated Company Name"
}
```

**Request Body (super_admin):**

```json
{
  "name": "Updated Company Name",
  "status": "suspended",
  "subscriptionPlan": "enterprise",
  "maxUsers": 100,
  "maxProjects": 50
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Tenant updated successfully",
  "data": {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Updated Company Name",
    "updatedAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `403 Forbidden`: tenant_admin trying to update restricted fields
- `404 Not Found`: Tenant not found

---

## 3. User Management APIs

### 3.1 Add User to Tenant

**Endpoint:** `POST /api/tenants/:tenantId/users`  
**Authentication:** Required  
**Authorization:** tenant_admin only  
**Description:** Add new user to tenant organization

**Request Body:**

```json
{
  "email": "newuser@demo.com",
  "password": "NewUser@123",
  "fullName": "New User",
  "role": "user"
}
```

**Validation Rules:**

- `email`: Required, valid email, unique per tenant
- `password`: Required, min 8 characters
- `fullName`: Required, 2-100 characters
- `role`: Optional, "user" or "tenant_admin" (default: "user")

**Success Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "33333333-3333-3333-3333-333333333333",
    "email": "newuser@demo.com",
    "fullName": "New User",
    "role": "user",
    "tenantId": "11111111-1111-1111-1111-111111111111",
    "isActive": true,
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `403 Forbidden`: Subscription limit reached OR not authorized
- `409 Conflict`: Email already exists in tenant

---

### 3.2 List Tenant Users

**Endpoint:** `GET /api/tenants/:tenantId/users`  
**Authentication:** Required  
**Authorization:** User must belong to tenant  
**Description:** List all users in tenant

**Query Parameters:**

- `search`: Search by name or email
- `role`: Filter by role
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "22222222-2222-2222-2222-222222222222",
        "email": "admin@demo.com",
        "fullName": "Demo Admin",
        "role": "tenant_admin",
        "isActive": true,
        "createdAt": "2026-01-01T00:00:00.000Z"
      },
      {
        "id": "33333333-3333-3333-3333-333333333333",
        "email": "user1@demo.com",
        "fullName": "Demo User One",
        "role": "user",
        "isActive": true,
        "createdAt": "2026-01-02T00:00:00.000Z"
      }
    ],
    "total": 5,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 50
    }
  }
}
```

---

### 3.3 Update User

**Endpoint:** `PUT /api/users/:userId`  
**Authentication:** Required  
**Authorization:** tenant_admin OR self (limited fields)  
**Description:** Update user information

**Request Body (self):**

```json
{
  "fullName": "Updated Name"
}
```

**Request Body (tenant_admin):**

```json
{
  "fullName": "Updated Name",
  "role": "tenant_admin",
  "isActive": false
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "33333333-3333-3333-3333-333333333333",
    "fullName": "Updated Name",
    "role": "user",
    "updatedAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `403 Forbidden`: Regular user trying to update role/isActive
- `404 Not Found`: User not found

---

### 3.4 Delete User

**Endpoint:** `DELETE /api/users/:userId`  
**Authentication:** Required  
**Authorization:** tenant_admin only  
**Description:** Delete user from tenant

**Success Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**

- `403 Forbidden`: Cannot delete self OR not authorized
- `404 Not Found`: User not found

---

## 4. Project Management APIs

### 4.1 Create Project

**Endpoint:** `POST /api/projects`  
**Authentication:** Required  
**Description:** Create new project in tenant

**Request Body:**

```json
{
  "name": "Website Redesign Project",
  "description": "Complete redesign of company website",
  "status": "active"
}
```

**Validation Rules:**

- `name`: Required, 3-200 characters
- `description`: Optional, max 2000 characters
- `status`: Optional, "active", "archived", or "completed" (default: "active")

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "55555555-5555-5555-5555-555555555555",
    "tenantId": "11111111-1111-1111-1111-111111111111",
    "name": "Website Redesign Project",
    "description": "Complete redesign of company website",
    "status": "active",
    "createdBy": "22222222-2222-2222-2222-222222222222",
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `403 Forbidden`: Project limit reached

---

### 4.2 List Projects

**Endpoint:** `GET /api/projects`  
**Authentication:** Required  
**Description:** List all projects in tenant

**Query Parameters:**

- `status`: Filter by status
- `search`: Search by name
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "55555555-5555-5555-5555-555555555555",
        "name": "Website Redesign Project",
        "description": "Complete redesign of company website",
        "status": "active",
        "createdBy": {
          "id": "22222222-2222-2222-2222-222222222222",
          "fullName": "Demo Admin"
        },
        "taskCount": 5,
        "completedTaskCount": 2,
        "createdAt": "2026-01-15T00:00:00.000Z"
      }
    ],
    "total": 3,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 20
    }
  }
}
```

---

### 4.3 Update Project

**Endpoint:** `PUT /api/projects/:projectId`  
**Authentication:** Required  
**Authorization:** tenant_admin OR project creator  
**Description:** Update project information

**Request Body:**

```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "archived"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "55555555-5555-5555-5555-555555555555",
    "name": "Updated Project Name",
    "description": "Updated description",
    "status": "archived",
    "updatedAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `403 Forbidden`: Not authorized
- `404 Not Found`: Project not found

---

### 4.4 Delete Project

**Endpoint:** `DELETE /api/projects/:projectId`  
**Authentication:** Required  
**Authorization:** tenant_admin OR project creator  
**Description:** Delete project (cascades to tasks)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Responses:**

- `403 Forbidden`: Not authorized
- `404 Not Found`: Project not found

---

## 5. Task Management APIs

### 5.1 Create Task

**Endpoint:** `POST /api/projects/:projectId/tasks`  
**Authentication:** Required  
**Description:** Create task in project

**Request Body:**

```json
{
  "title": "Design homepage mockup",
  "description": "Create high-fidelity design",
  "assignedTo": "33333333-3333-3333-3333-333333333333",
  "priority": "high",
  "dueDate": "2026-07-15"
}
```

**Validation Rules:**

- `title`: Required, 3-200 characters
- `description`: Optional, max 2000 characters
- `assignedTo`: Optional, must be valid user ID in same tenant
- `priority`: Optional, "low", "medium", or "high" (default: "medium")
- `dueDate`: Optional, ISO date format

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "77777777-7777-7777-7777-777777777777",
    "projectId": "55555555-5555-5555-5555-555555555555",
    "tenantId": "11111111-1111-1111-1111-111111111111",
    "title": "Design homepage mockup",
    "description": "Create high-fidelity design",
    "status": "todo",
    "priority": "high",
    "assignedTo": "33333333-3333-3333-3333-333333333333",
    "dueDate": "2026-07-15",
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: assignedTo user doesn't belong to tenant
- `403 Forbidden`: Project doesn't belong to user's tenant

---

### 5.2 List Project Tasks

**Endpoint:** `GET /api/projects/:projectId/tasks`  
**Authentication:** Required  
**Description:** List all tasks in project

**Query Parameters:**

- `status`: Filter by status (todo, in_progress, completed)
- `assignedTo`: Filter by user ID
- `priority`: Filter by priority
- `search`: Search by title
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "77777777-7777-7777-7777-777777777777",
        "title": "Design homepage mockup",
        "description": "Create high-fidelity design",
        "status": "in_progress",
        "priority": "high",
        "assignedTo": {
          "id": "33333333-3333-3333-3333-333333333333",
          "fullName": "Demo User One",
          "email": "user1@demo.com"
        },
        "dueDate": "2026-07-15",
        "createdAt": "2026-02-01T00:00:00.000Z"
      }
    ],
    "total": 5,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 50
    }
  }
}
```

---

### 5.3 Update Task Status

**Endpoint:** `PATCH /api/tasks/:taskId/status`  
**Authentication:** Required  
**Description:** Update task status only

**Request Body:**

```json
{
  "status": "completed"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "77777777-7777-7777-7777-777777777777",
    "status": "completed",
    "updatedAt": "2026-02-09T10:30:00.000Z"
  }
}
```

---

### 5.4 Update Task

**Endpoint:** `PUT /api/tasks/:taskId`  
**Authentication:** Required  
**Description:** Update task (all fields)

**Request Body:**

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "high",
  "assignedTo": "33333333-3333-3333-3333-333333333333",
  "dueDate": "2026-08-01",
  "status": "in_progress"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "77777777-7777-7777-7777-777777777777",
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in_progress",
    "priority": "high",
    "assignedTo": {
      "id": "33333333-3333-3333-3333-333333333333",
      "fullName": "Demo User One",
      "email": "user1@demo.com"
    },
    "dueDate": "2026-08-01",
    "updatedAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: assignedTo user doesn't belong to tenant
- `403 Forbidden`: Task doesn't belong to user's tenant
- `404 Not Found`: Task not found

---

### 5.5 Delete Task

**Endpoint:** `DELETE /api/tasks/:taskId`  
**Authentication:** Required  
**Description:** Delete task

**Success Response (200):**

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 6. System APIs

### 6.1 Health Check

**Endpoint:** `GET /api/health`  
**Authentication:** None (Public)  
**Description:** Check system health and database connection

**Success Response (200):**

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-09T10:30:00.000Z"
}
```

**Error Response (500):**

```json
{
  "status": "error",
  "database": "disconnected",
  "timestamp": "2026-02-09T10:30:00.000Z"
}
```

---

## HTTP Status Codes Summary

| Code | Meaning               | Usage                                 |
| ---- | --------------------- | ------------------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE, PATCH    |
| 201  | Created               | Successful POST (resource created)    |
| 400  | Bad Request           | Validation errors, invalid input      |
| 401  | Unauthorized          | Missing or invalid token              |
| 403  | Forbidden             | Insufficient permissions              |
| 404  | Not Found             | Resource doesn't exist                |
| 409  | Conflict              | Duplicate resource (email, subdomain) |
| 500  | Internal Server Error | Server error                          |

---

## Authentication Header Format

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Payload:**

```json
{
  "userId": "22222222-2222-2222-2222-222222222222",
  "tenantId": "11111111-1111-1111-1111-111111111111",
  "role": "tenant_admin",
  "iat": 1707476400,
  "exp": 1707562800
}
```

**Token Expiry:** 24 hours from issue time

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

**Validation errors may include field details:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Postman Collection

Import this base configuration into Postman:

**Environment Variables:**

- `base_url`: http://localhost:5000
- `token`: (set after login)

**Pre-request Script (for authenticated requests):**

```javascript
pm.request.headers.add({
  key: "Authorization",
  value: "Bearer " + pm.environment.get("token"),
});
```

---

**Total Endpoints:** 19 APIs across 6 categories
