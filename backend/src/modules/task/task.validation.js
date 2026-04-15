const { z } = require('zod');

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(120),
    description: z.string().max(500).optional().default(''),
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().datetime().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().max(500).optional(),
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().datetime().nullable().optional(),
  }),
  params: z.object({
    taskId: z.string().min(12),
  }),
  query: z.object({}),
});

const listTaskSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
  }),
});

module.exports = { createTaskSchema, updateTaskSchema, listTaskSchema };
