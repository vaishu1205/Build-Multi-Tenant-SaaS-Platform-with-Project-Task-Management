import express from 'express';
import { registerTenant, login, me, logout } from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register-tenant', registerTenant);
router.post('/login', login);
router.get('/me', auth, me);
router.post('/logout', auth, logout);

export default router;
