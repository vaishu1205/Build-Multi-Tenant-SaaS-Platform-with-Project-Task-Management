import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import healthRoutes from "./routes/health.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api", userRoutes);
app.use("/api", projectRoutes);
app.use("/api", taskRoutes);
app.use("/api", healthRoutes);
app.use("/api", dashboardRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

export default app;
