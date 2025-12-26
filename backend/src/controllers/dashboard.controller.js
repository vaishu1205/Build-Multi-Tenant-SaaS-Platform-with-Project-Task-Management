import pool from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  const tenantId = req.user.tenantId;
  const userId = req.user.userId;

  // Tenant-wide stats
  const stats = await pool.query(
    `
    SELECT
      (SELECT COUNT(*) FROM projects WHERE tenant_id=$1) AS total_projects,
      (SELECT COUNT(*) FROM tasks WHERE tenant_id=$1) AS total_tasks,
      (SELECT COUNT(*) FROM tasks WHERE tenant_id=$1 AND status='completed') AS completed_tasks
    `,
    [tenantId]
  );

  // My tasks
  const myTasks = await pool.query(
    `
    SELECT t.id,t.title,t.status,t.priority,p.name AS project_name
    FROM tasks t
    JOIN projects p ON t.project_id=p.id
    WHERE t.assigned_to=$1
    ORDER BY t.due_date ASC
    `,
    [userId]
  );

  res.json({
    success: true,
    data: {
      stats: stats.rows[0],
      myTasks: myTasks.rows,
    },
  });
};
