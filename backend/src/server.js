import "./config/env.js";
import app from "./app.js";
import pool from "./config/db.js";
import runMigrations from "./utils/migrate.js";
import seed from "./seeds/seed.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    console.log(" Connecting to database...");
    await pool.query("SELECT 1");
    console.log(" Database connected");

    if (process.env.NODE_ENV !== "production") {
      console.log(" Running migrations...");
      await runMigrations();

      console.log(" Running seeds...");
      await seed();
    }

    app.listen(PORT, () => {
      console.log(` Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" Server startup failed:", err);
    process.exit(1);
  }
};

start();
