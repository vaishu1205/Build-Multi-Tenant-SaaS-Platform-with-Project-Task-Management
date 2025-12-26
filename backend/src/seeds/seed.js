import bcrypt from "bcrypt";
import pool from "../config/db.js";

/**
 * FIXED IDS — DO NOT CHANGE
 */
const TENANT_ID = "11111111-1111-1111-1111-111111111111";
const ADMIN_ID = "22222222-2222-2222-2222-222222222222";
const USER1_ID = "33333333-3333-3333-3333-333333333333";
const USER2_ID = "44444444-4444-4444-4444-444444444444";

const PROJECT1_ID = "55555555-5555-5555-5555-555555555555";
const PROJECT2_ID = "66666666-6666-6666-6666-666666666666";

const TASK1_ID = "77777777-7777-7777-7777-777777777777";
const TASK2_ID = "88888888-8888-8888-8888-888888888888";
const TASK3_ID = "99999999-9999-9999-9999-999999999999";
const TASK4_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const TASK5_ID = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

const seed = async () => {
  const adminPassword = await bcrypt.hash("Demo@123", 10);
  const userPassword = await bcrypt.hash("User@123", 10);

  /* ---------------- TENANT ---------------- */
  await pool.query(
    `
    INSERT INTO tenants (id, name, subdomain, status, subscription_plan)
    VALUES ($1, 'Demo Company', 'demo', 'active', 'pro')
    ON CONFLICT (subdomain) DO NOTHING
    `,
    [TENANT_ID]
  );

  /* ---------------- USERS ---------------- */
  await pool.query(
    `
    INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
    VALUES
      ($1, $2, 'admin@demo.com', $3, 'Demo Admin', 'tenant_admin'),
      ($4, $2, 'user1@demo.com', $5, 'Demo User One', 'user'),
      ($6, $2, 'user2@demo.com', $5, 'Demo User Two', 'user')
    ON CONFLICT (tenant_id, email) DO NOTHING
    `,
    [ADMIN_ID, TENANT_ID, adminPassword, USER1_ID, userPassword, USER2_ID]
  );

  /* ---------------- PROJECTS ---------------- */
  await pool.query(
    `
    INSERT INTO projects (id, tenant_id, name, description, status, created_by)
    VALUES
      ($1, $2, 'Project Alpha', 'First demo project', 'active', $3),
      ($4, $2, 'Project Beta', 'Second demo project', 'active', $3)
    ON CONFLICT (id) DO NOTHING
    `,
    [PROJECT1_ID, TENANT_ID, ADMIN_ID, PROJECT2_ID]
  );

  /* ---------------- TASKS ---------------- */
  await pool.query(
    `
    INSERT INTO tasks (
      id, project_id, tenant_id, title, description,
      status, priority, assigned_to, due_date
    )
    VALUES
      ($1, $2, $3, 'Task 1', 'First task', 'todo', 'medium', NULL, NULL),
      ($4, $2, $3, 'Task 2', 'Second task', 'in_progress', 'high', NULL, NULL),
      ($5, $6, $3, 'Task 3', 'Third task', 'completed', 'low', NULL, NULL),
      ($7, $6, $3, 'Task 4', 'Fourth task', 'todo', 'medium', NULL, NULL),
      ($8, $6, $3, 'Task 5', 'Fifth task', 'todo', 'high', NULL, NULL)
    ON CONFLICT (id) DO NOTHING
    `,
    [
      TASK1_ID,
      PROJECT1_ID,
      TENANT_ID,
      TASK2_ID,
      TASK3_ID,
      PROJECT2_ID,
      TASK4_ID,
      TASK5_ID,
    ]
  );

  console.log("✅ DATABASE SEEDED SUCCESSFULLY");
};

export default seed;

// import bcrypt from "bcrypt";
// import { v4 as uuid } from "uuid";
// import pool from "../config/db.js";

// const seed = async () => {
//   const superAdminId = uuid();
//   const tenantId = uuid();
//   const adminId = uuid();
//   const user1Id = uuid();
//   const user2Id = uuid();

//   const project1Id = uuid();
//   const project2Id = uuid();

//   const task1Id = uuid();
//   const task2Id = uuid();
//   const task3Id = uuid();
//   const task4Id = uuid();
//   const task5Id = uuid();

//   const superAdminPassword = await bcrypt.hash("Admin@123", 10);
//   const adminPassword = await bcrypt.hash("Demo@123", 10);
//   const userPassword = await bcrypt.hash("User@123", 10);

//   // Super Admin
//   await pool.query(
//     `
//     INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
//     VALUES ($1, NULL, 'superadmin@system.com', $2, 'System Admin', 'super_admin')
//     ON CONFLICT DO NOTHING
//     `,
//     [superAdminId, superAdminPassword]
//   );

//   // Tenant
//   await pool.query(
//     `
//     INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects)
//     VALUES ($1, 'Demo Company', 'demo', 'active', 'pro', 25, 15)
//     ON CONFLICT DO NOTHING
//     `,
//     [tenantId]
//   );

//   // Users
//   await pool.query(
//     `
//     INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
//     VALUES
//       ($1, $2, 'admin@demo.com', $3, 'Demo Admin', 'tenant_admin'),
//       ($4, $2, 'user1@demo.com', $5, 'Demo User One', 'user'),
//       ($6, $2, 'user2@demo.com', $5, 'Demo User Two', 'user')
//     ON CONFLICT DO NOTHING
//     `,
//     [adminId, tenantId, adminPassword, user1Id, userPassword, user2Id]
//   );

//   // Projects
//   await pool.query(
//     `
//     INSERT INTO projects (id, tenant_id, name, description, status, created_by)
//     VALUES
//       ($1, $2, 'Project Alpha', 'First demo project', 'active', $3),
//       ($4, $2, 'Project Beta', 'Second demo project', 'active', $3)
//     ON CONFLICT DO NOTHING
//     `,
//     [project1Id, tenantId, adminId, project2Id]
//   );

//   // Tasks (FIXED PROPERLY)
//   await pool.query(
//     `
//     INSERT INTO tasks (
//       id,
//       project_id,
//       tenant_id,
//       title,
//       description,
//       status,
//       priority,
//       assigned_to,
//       due_date
//     )
//     VALUES
//       ($1, $2, $3, 'Task 1', 'First task', 'todo', 'medium', NULL, NULL),
//       ($4, $2, $3, 'Task 2', 'Second task', 'in_progress', 'high', NULL, NULL),
//       ($5, $6, $3, 'Task 3', 'Third task', 'completed', 'low', NULL, NULL),
//       ($7, $6, $3, 'Task 4', 'Fourth task', 'todo', 'medium', NULL, NULL),
//       ($8, $6, $3, 'Task 5', 'Fifth task', 'todo', 'high', NULL, NULL)
//     ON CONFLICT DO NOTHING
//     `,
//     [
//       task1Id,
//       project1Id,
//       tenantId,
//       task2Id,
//       task3Id,
//       project2Id,
//       task4Id,
//       task5Id,
//     ]
//   );
// };

// export default seed;
