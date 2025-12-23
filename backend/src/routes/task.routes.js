import express from 'express';
import auth from '../middleware/auth.js';
import {
  createTask,
  listTasks,
  updateTaskStatus,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';

const router = express.Router();

router.post('/projects/:projectId/tasks', auth, createTask);
router.get('/projects/:projectId/tasks', auth, listTasks);
router.patch('/tasks/:taskId/status', auth, updateTaskStatus);
router.put('/tasks/:taskId', auth, updateTask);
router.delete('/tasks/:taskId', auth, deleteTask);

export default router;
