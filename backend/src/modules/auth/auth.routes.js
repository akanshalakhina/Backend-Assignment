const express = require('express');
const validate = require('../../middlewares/validate');
const { registerSchema, loginSchema } = require('./auth.validation');
const { register, login, me } = require('./auth.controller');
const { authenticate } = require('./auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, me);

module.exports = router;
