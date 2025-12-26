import fs from "fs";
import path from "path";
import pool from "../config/db.js";

const runMigrations = async () => {
  const migrationsDir = path.resolve("migrations");
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    await pool.query(sql);
  }
};

export default runMigrations;
