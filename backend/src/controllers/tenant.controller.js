import pool from '../config/db.js';

export const getTenant = async (req, res) => {
  const { tenantId } = req.params;

  if (req.user.role !== 'super_admin' && req.user.tenantId !== tenantId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const tenant = await pool.query(
    `SELECT id,name,subdomain,status,subscription_plan,max_users,max_projects,created_at
     FROM tenants WHERE id=$1`,
    [tenantId]
  );

  if (!tenant.rows.length) {
    return res.status(404).json({ success: false, message: 'Tenant not found' });
  }

  const stats = await pool.query(
    `
    SELECT
      (SELECT COUNT(*) FROM users WHERE tenant_id=$1) AS total_users,
      (SELECT COUNT(*) FROM projects WHERE tenant_id=$1) AS total_projects,
      (SELECT COUNT(*) FROM tasks WHERE tenant_id=$1) AS total_tasks
    `,
    [tenantId]
  );

  res.json({
    success: true,
    data: {
      ...tenant.rows[0],
      stats: stats.rows[0]
    }
  });
};

export const updateTenant = async (req, res) => {
  const { tenantId } = req.params;
  const { name, status, subscriptionPlan, maxUsers, maxProjects } = req.body;

  if (req.user.role === 'tenant_admin') {
    if (status || subscriptionPlan || maxUsers || maxProjects) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
  }

  const fields = [];
  const values = [];
  let idx = 1;

  if (name) {
    fields.push(`name=$${idx++}`);
    values.push(name);
  }
  if (req.user.role === 'super_admin') {
    if (status) {
      fields.push(`status=$${idx++}`);
      values.push(status);
    }
    if (subscriptionPlan) {
      fields.push(`subscription_plan=$${idx++}`);
      values.push(subscriptionPlan);
    }
    if (maxUsers) {
      fields.push(`max_users=$${idx++}`);
      values.push(maxUsers);
    }
    if (maxProjects) {
      fields.push(`max_projects=$${idx++}`);
      values.push(maxProjects);
    }
  }

  await pool.query(
    `UPDATE tenants SET ${fields.join(', ')}, updated_at=NOW() WHERE id=$${idx}`,
    [...values, tenantId]
  );

  res.json({ success: true, message: 'Tenant updated successfully' });
};

export const listTenants = async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const tenants = await pool.query(
    `SELECT id,name,subdomain,status,subscription_plan,created_at FROM tenants ORDER BY created_at DESC`
  );

  res.json({ success: true, data: { tenants: tenants.rows } });
};
