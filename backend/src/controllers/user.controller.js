import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import pool from '../config/db.js';

export const addUser = async (req, res) => {
  const { tenantId } = req.params;
  const { email, password, fullName, role = 'user' } = req.body;

  if (req.user.role !== 'tenant_admin' || req.user.tenantId !== tenantId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const tenant = await pool.query(
    `SELECT max_users FROM tenants WHERE id=$1`,
    [tenantId]
  );

  const count = await pool.query(
    `SELECT COUNT(*) FROM users WHERE tenant_id=$1`,
    [tenantId]
  );

  if (Number(count.rows[0].count) >= tenant.rows[0].max_users) {
    return res.status(403).json({ success: false, message: 'Subscription limit reached' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const userId = uuid();
  await pool.query(
    `INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [userId, tenantId, email, passwordHash, fullName, role]
  );

  res.status(201).json({
    success: true,
    data: { id: userId, email, fullName, role, tenantId }
  });
};

export const listUsers = async (req, res) => {
  const { tenantId } = req.params;

  if (req.user.role !== 'super_admin' && req.user.tenantId !== tenantId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  const users = await pool.query(
    `SELECT id,email,full_name,role,is_active,created_at
     FROM users WHERE tenant_id=$1 ORDER BY created_at DESC`,
    [tenantId]
  );

  res.json({ success: true, data: { users: users.rows } });
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { fullName, role, isActive } = req.body;

  const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
  if (!user.rows.length) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (req.user.role !== 'tenant_admin' && req.user.userId !== userId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  if (role || typeof isActive !== 'undefined') {
    if (req.user.role !== 'tenant_admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
  }

  await pool.query(
    `UPDATE users SET
      full_name = COALESCE($1, full_name),
      role = COALESCE($2, role),
      is_active = COALESCE($3, is_active),
      updated_at = NOW()
     WHERE id=$4`,
    [fullName, role, isActive, userId]
  );

  res.json({ success: true, message: 'User updated successfully' });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (req.user.userId === userId) {
    return res.status(403).json({ success: false, message: 'Cannot delete self' });
  }

  await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);

  res.json({ success: true, message: 'User deleted successfully' });
};
