// import express from "express";
// import { registerTenant, login } from "../controllers/auth.controller.js";

// const router = express.Router();

// router.post("/register-tenant", registerTenant);
// router.post("/login", login);
// //
// export default router;
import express from "express";
import {
  registerTenant,
  login,
  me,
  logout,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js"; // Your existing middleware

const router = express.Router();

router.post("/register-tenant", registerTenant);
router.post("/login", login);
router.get("/me", auth, me); // ⭐ ADD THIS LINE
router.post("/logout", auth, logout); // ⭐ ADD THIS LINE (optional)

export default router;
