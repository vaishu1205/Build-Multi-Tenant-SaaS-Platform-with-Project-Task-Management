import './config/env.js';
import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await pool.query('SELECT 1');
  app.listen(PORT);
};

start();
