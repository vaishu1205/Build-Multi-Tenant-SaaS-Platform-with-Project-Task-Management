# Multi-Tenant SaaS Platform – Project & Task Management

A production-ready **multi-tenant SaaS application** that allows multiple organizations (tenants) to manage users, projects, and tasks with **complete data isolation**, **role-based access control**, and **subscription plan enforcement**.

This project was built as part of a mandatory full-stack system design and implementation task.

## Demo Video

YouTube Link:  
https://youtu.be/9Brp2TxdycA

This video demonstrates:

- Multi-tenant SaaS architecture
- Tenant registration and subdomain-based login
- Role-based access control (Super Admin, Tenant Admin, User)
- Project and task management
- Task assignment and status updates
- Dashboard statistics
- Data isolation between tenants
- Unauthorized access handling
- Docker-based deployment

---

## 🚀 Features

- Multi-tenant architecture with strict tenant data isolation
- Subdomain-based tenant login
- JWT-based authentication (24h expiry)
- Role-Based Access Control (RBAC)
  - Super Admin
  - Tenant Admin
  - User
- Project & Task Management
- Subscription plans with enforced limits
- Audit logging for critical actions
- Fully Dockerized (Database + Backend + Frontend)
- Automatic database migrations & seed data
- Health check endpoint
- Responsive React frontend

---

## 🧑‍💻 User Roles

### Super Admin

- Access all tenants
- Manage subscription plans and limits
- View system-wide data

### Tenant Admin

- Manage users in their tenant
- Create and manage projects & tasks
- View tenant-level analytics

### User

- View assigned projects and tasks
- Update task status

---

## 🛠️ Tech Stack

### Frontend

- React (CRA)
- JavaScript
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt (password hashing)

### Database

- PostgreSQL
- UUID primary keys
- ENUM types for status & priority

### DevOps

- Docker
- Docker Compose

---

## 🏗️ Architecture Overview

- **Frontend**: React app running on port `3000`
- **Backend**: Express API running on port `5000`
- **Database**: PostgreSQL running on port `5432`
- All services communicate via Docker network
- Tenant isolation enforced using `tenant_id`

---

## 🧱 Database Schema

Core tables:

- `tenants`
- `users`
- `projects`
- `tasks`
- `audit_logs`

Key rules:

- Email is unique **per tenant**
- Super admin has `tenant_id = NULL`
- All tenant data filtered using `tenant_id`

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Token payload includes:
  ```json
  {
    "userId": "uuid",
    "tenantId": "uuid | null",
    "role": "super_admin | tenant_admin | user"
  }
  ```
  📡 API Overview

Base URL:

http://localhost:5000/api

Modules:

Auth

Tenants

Users

Projects

Tasks

Dashboard

Health

All responses follow:

{
"success": true,
"message": "optional",
"data": {}
}

🩺 Health Check

Endpoint:

GET /api/health

Response:

{
"status": "ok",
"database": "connected",
"timestamp": "ISO_DATE"
}

🐳 Docker Setup (MANDATORY)
Prerequisites

Docker

Docker Compose

One-Command Start
docker-compose up -d

Services & Ports
Service Port
Frontend 3000
Backend 5000
Database 5432
🗄️ Automatic Database Setup

On startup:

Migrations run automatically

Seed data loads automatically

No manual commands required

🔑 Test Credentials
Super Admin
Email: superadmin@system.com
Password: Admin@123

Demo Tenant Admin
Subdomain: demo
Email: admin@demo.com
Password: Demo@123

Demo Users
user1@demo.com / User@123
user2@demo.com / User@123

📁 Project Structure
backend/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ ├── utils/
│ ├── seeds/
│ └── server.js
├── Dockerfile
└── .env

frontend/
├── src/
│ ├── pages/
│ ├── components/
│ ├── api/
│ └── App.js
├── Dockerfile
└── package.json

🎥 Demo Video

YouTube Demo Link:
👉 (Already submitted)

✅ Status

✔ Backend APIs implemented
✔ Frontend UI implemented
✔ Dockerized & deployable
✔ Meets evaluation checklist
