import express from "express";
import auth from "../middleware/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/dashboard", auth, getDashboardStats);

export default router;
