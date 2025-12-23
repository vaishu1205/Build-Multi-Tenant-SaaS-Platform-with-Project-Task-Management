import './config/env.js';
import app from './app.js';
import pool from './config/db.js';
import runMigrations from './utils/migrate.js';
import seed from '../seeds/seed.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await pool.query('SELECT 1');
  await runMigrations();
  await seed();
  app.listen(PORT);
};

start();
