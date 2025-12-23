import express from 'express';
import auth from '../middleware/auth.js';
import {
  createProject,
  listProjects,
  updateProject,
  deleteProject
} from '../controllers/project.controller.js';

const router = express.Router();

router.post('/projects', auth, createProject);
router.get('/projects', auth, listProjects);
router.put('/projects/:projectId', auth, updateProject);
router.delete('/projects/:projectId', auth, deleteProject);

export default router;
