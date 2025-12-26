import express from "express";
import auth from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.js";
import {
  getTenant,
  updateTenant,
  listTenants,
} from "../controllers/tenant.controller.js";

const router = express.Router();

router.get("/", auth, authorize("super_admin"), listTenants);
router.get("/:tenantId", auth, getTenant);
router.put("/:tenantId", auth, updateTenant);

export default router;
