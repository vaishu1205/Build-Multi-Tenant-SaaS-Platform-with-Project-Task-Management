import { v4 as uuid } from 'uuid';
import pool from '../config/db.js';

export const createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, priority = 'medium', dueDate } = req.body;

  const project = await pool.query(
    `SELECT tenant_id FROM projects WHERE id=$1`,
    [projectId]
  );

  if (!project.rows.length || project.rows[0].tenant_id !== req.user.tenantId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  if (assignedTo) {
    const user = await pool.query(
      `SELECT id FROM users WHERE id=$1 AND tenant_id=$2`,
      [assignedTo, req.user.tenantId]
    );
    if (!user.rows.length) {
      return res.status(400).json({ success: false, message: 'Invalid assignee' });
    }
  }

  const taskId = uuid();

  await pool.query(
    `INSERT INTO tasks
     (id, project_id, tenant_id, title, description, priority, assigned_to, due_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      taskId,
      projectId,
      project.rows[0].tenant_id,
      title,
      description,
      priority,
      assignedTo || null,
      dueDate || null
    ]
  );

  res.status(201).json({
    success: true,
    data: { id: taskId, title, priority }
  });
};

export const listTasks = async (req, res) => {
  const { projectId } = req.params;

  const tasks = await pool.query(
    `
    SELECT t.id,t.title,t.description,t.status,t.priority,t.due_date,
           u.id AS user_id,u.full_name,u.email
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.project_id=$1 AND t.tenant_id=$2
    ORDER BY t.priority DESC, t.due_date ASC
    `,
    [projectId, req.user.tenantId]
  );

  res.json({ success: true, data: { tasks: tasks.rows } });
};

export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  await pool.query(
    `UPDATE tasks SET status=$1, updated_at=NOW()
     WHERE id=$2 AND tenant_id=$3`,
    [status, taskId, req.user.tenantId]
  );

  res.json({ success: true, message: 'Task status updated' });
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, priority, assignedTo, dueDate } = req.body;

  if (assignedTo) {
    const user = await pool.query(
      `SELECT id FROM users WHERE id=$1 AND tenant_id=$2`,
      [assignedTo, req.user.tenantId]
    );
    if (!user.rows.length) {
      return res.status(400).json({ success: false, message: 'Invalid assignee' });
    }
  }

  await pool.query(
    `UPDATE tasks SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      priority = COALESCE($4, priority),
      assigned_to = $5,
      due_date = $6,
      updated_at = NOW()
     WHERE id=$7 AND tenant_id=$8`,
    [
      title,
      description,
      status,
      priority,
      assignedTo || null,
      dueDate || null,
      taskId,
      req.user.tenantId
    ]
  );

  res.json({ success: true, message: 'Task updated successfully' });
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  await pool.query(
    `DELETE FROM tasks WHERE id=$1 AND tenant_id=$2`,
    [taskId, req.user.tenantId]
  );

  res.json({ success: true, message: 'Task deleted successfully' });
};
