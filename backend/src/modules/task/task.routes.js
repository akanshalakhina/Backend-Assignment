const express = require('express');
const validate = require('../../middlewares/validate');
const { authenticate, authorize } = require('../auth/auth.middleware');
const {
  createTaskSchema,
  updateTaskSchema,
  listTaskSchema,
} = require('./task.validation');
const {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
  adminListAllTasks,
} = require('./task.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', validate(listTaskSchema), listTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/admin/all', authorize('admin'), adminListAllTasks);

router.get('/:taskId', getTaskById);
router.patch('/:taskId', validate(updateTaskSchema), updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;
