const mongoose = require('mongoose');
const Task = require('./task.model');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');

const createTask = catchAsync(async (req, res) => {
  const payload = { ...req.body, owner: req.user._id };
  const task = await Task.create(payload);

  return res.status(201).json(new ApiResponse(201, 'Task created', task));
});

const listTasks = catchAsync(async (req, res) => {
  const { status, priority, page = 1, limit = 10 } = req.query;

  const filter = { owner: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, 'Tasks fetched', {
      items: tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  );
});

const getTaskById = catchAsync(async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  const task = await Task.findOne({ _id: taskId, owner: req.user._id });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return res.status(200).json(new ApiResponse(200, 'Task fetched', task));
});

const updateTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, owner: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return res.status(200).json(new ApiResponse(200, 'Task updated', task));
});

const deleteTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  const task = await Task.findOneAndDelete({ _id: taskId, owner: req.user._id });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return res.status(200).json(new ApiResponse(200, 'Task deleted'));
});

const adminListAllTasks = catchAsync(async (req, res) => {
  const tasks = await Task.find({}).populate('owner', 'name email role').sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, 'All tasks for admin', tasks));
});

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  deleteTask,
  adminListAllTasks,
};
