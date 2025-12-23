import { v4 as uuid } from 'uuid';
import pool from '../config/db.js';

export const createProject = async (req, res) => {
  const { name, description, status = 'active' } = req.body;
  const { tenantId, userId } = req.user;

  const tenant = await pool.query(
    `SELECT max_projects FROM tenants WHERE id=$1`,
    [tenantId]
  );

  const count = await pool.query(
    `SELECT COUNT(*) FROM projects WHERE tenant_id=$1`,
    [tenantId]
  );

  if (Number(count.rows[0].count) >= tenant.rows[0].max_projects) {
    return res.status(403).json({ success: false, message: 'Project limit reached' });
  }

  const projectId = uuid();

  await pool.query(
    `INSERT INTO projects (id, tenant_id, name, description, status, created_by)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [projectId, tenantId, name, description, status, userId]
  );

  res.status(201).json({
    success: true,
    data: {
      id: projectId,
      tenantId,
      name,
      description,
      status
    }
  });
};

export const listProjects = async (req, res) => {
  const { tenantId } = req.user;

  const projects = await pool.query(
    `
    SELECT p.id,p.name,p.description,p.status,p.created_at,
           u.full_name AS created_by
    FROM projects p
    JOIN users u ON p.created_by = u.id
    WHERE p.tenant_id=$1
    ORDER BY p.created_at DESC
    `,
    [tenantId]
  );

  res.json({ success: true, data: { projects: projects.rows } });
};

export const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description, status } = req.body;

  const project = await pool.query(
    `SELECT * FROM projects WHERE id=$1`,
    [projectId]
  );

  if (!project.rows.length) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  if (
    req.user.role !== 'tenant_admin' &&
    project.rows[0].created_by !== req.user.userId
  ) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  await pool.query(
    `UPDATE projects SET
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      updated_at = NOW()
     WHERE id=$4`,
    [name, description, status, projectId]
  );

  res.json({ success: true, message: 'Project updated successfully' });
};

export const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  const project = await pool.query(
    `SELECT * FROM projects WHERE id=$1`,
    [projectId]
  );

  if (!project.rows.length) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  if (
    req.user.role !== 'tenant_admin' &&
    project.rows[0].created_by !== req.user.userId
  ) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  await pool.query(`DELETE FROM projects WHERE id=$1`, [projectId]);

  res.json({ success: true, message: 'Project deleted successfully' });
};
