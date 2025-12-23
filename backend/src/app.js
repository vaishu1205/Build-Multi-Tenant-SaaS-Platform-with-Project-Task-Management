import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import userRoutes from './routes/user.routes.js';


const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api', userRoutes);



export default app;
