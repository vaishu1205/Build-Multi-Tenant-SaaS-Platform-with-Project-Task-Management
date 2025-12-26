import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  addUser,
  listUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/tenants/:tenantId/users", auth, addUser);
router.get("/tenants/:tenantId/users", auth, listUsers);
router.put("/users/:userId", auth, updateUser);
router.delete("/users/:userId", auth, deleteUser);

export default router;
