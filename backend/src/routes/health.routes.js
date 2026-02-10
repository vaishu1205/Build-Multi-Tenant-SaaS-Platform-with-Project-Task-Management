// import express from "express";
// import { healthCheck } from "../controllers/health.controller.js";

// const router = express.Router();

// // router.get("/health", healthCheck);
// router.get("/health", async (req, res) => {
//   try {
//     await db.query("SELECT 1");
//     res.json({ status: "ok", database: "connected" });
//   } catch (err) {
//     res.status(500).json({ status: "error", database: "disconnected" });
//   }
// });

// export default router;

import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
