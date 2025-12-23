import pool from '../config/db.js';

export const healthCheck = async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected'
    });
  } catch {
    res.status(500).json({
      status: 'error',
      database: 'disconnected'
    });
  }
};
