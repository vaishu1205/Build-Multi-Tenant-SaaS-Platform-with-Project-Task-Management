import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import pool from '../src/config/db.js';

const seed = async () => {
  const superAdminId = uuid();
  const tenantId = uuid();
  const adminId = uuid();
  const user1Id = uuid();
  const user2Id = uuid();
  const project1Id = uuid();
  const project2Id = uuid();
  const taskIds = Array.from({ length: 5 }, () => uuid());

  const superAdminPassword = await bcrypt.hash('Admin@123', 10);
  const adminPassword = await bcrypt.hash('Demo@123', 10);
  const userPassword = await bcrypt.hash('User@123', 10);

  await pool.query(`
    INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
    VALUES ($1, NULL, 'superadmin@system.com', $2, 'System Admin', 'super_admin')
    ON CONFLICT DO NOTHING
  `, [superAdminId, superAdminPassword]);

  await pool.query(`
    INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects)
    VALUES ($1, 'Demo Company', 'demo', 'active', 'pro', 25, 15)
    ON CONFLICT DO NOTHING
  `, [tenantId]);

  await pool.query(`
    INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
    VALUES
      ($1, $2, 'admin@demo.com', $3, 'Demo Admin', 'tenant_admin'),
      ($4, $2, 'user1@demo.com', $5, 'Demo User One', 'user'),
      ($6, $2, 'user2@demo.com', $5, 'Demo User Two', 'user')
    ON CONFLICT DO NOTHING
  `, [adminId, tenantId, adminPassword, user1Id, userPassword, user2Id]);

  await pool.query(`
    INSERT INTO projects (id, tenant_id, name, description, status, created_by)
    VALUES
      ($1, $2, 'Project Alpha', 'First demo project', 'active', $3),
      ($4, $2, 'Project Beta', 'Second demo project', 'active', $3)
    ON CONFLICT DO NOTHING
  `, [project1Id, tenantId, adminId, project2Id]);

  await pool.query(`
    INSERT INTO tasks (id, project_id, tenant_id, title, status, priority)
    VALUES
      ($1, $2, $3, 'Task 1', 'todo', 'medium'),
      ($4, $2, $3, 'Task 2', 'in_progress', 'high'),
      ($5, $6, $3, 'Task 3', 'completed', 'low'),
      ($7, $6, $3, 'Task 4', 'todo', 'medium'),
      ($8, $6, $3, 'Task 5', 'todo', 'high')
    ON CONFLICT DO NOTHING
  `, [
    taskIds[0], project1Id, tenantId,
    taskIds[1], project1Id,
    taskIds[2], project2Id,
    taskIds[3], project2Id,
    taskIds[4]
  ]);
};

export default seed;
